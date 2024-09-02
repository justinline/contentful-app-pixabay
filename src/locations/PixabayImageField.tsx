import type { FieldAppSDK } from "@contentful/app-sdk";
import { Button, Card, Flex } from "@contentful/f36-components";
import { SearchIcon } from "@contentful/f36-icons";
import { useFieldValue, useSDK } from "@contentful/react-apps-toolkit";
import { useEffect, useState } from "react";
import { z } from "zod";
import SelectedImagePreview from "../components/SelectedImagePreview";

const SelectedImagesSchema = z.array(z.string());

function PixabayImageField() {
	const sdk = useSDK<FieldAppSDK>();
	const [selectedImages, setSelectedImages] =
		useFieldValue<string[]>("pixabayurl");

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		try {
			const value = SelectedImagesSchema.parse(sdk.field.getValue());
			setSelectedImages(value);
		} catch (error) {
			// We have corrupt data here, depending on the end user's use-case we might want to handle it differently.
			sdk.field.removeValue();
			setSelectedImages([]);
		}
	}, [sdk.field, setSelectedImages]);

	const openDialog = async () => {
		const result = await sdk.dialogs.openCurrent({
			width: "fullWidth",
			minHeight: "600px",
			position: "center",
			title: "Select images from Pixabay",
			shouldCloseOnOverlayClick: true,
			shouldCloseOnEscapePress: true,
		});

		setIsLoading(true);

		try {
			const parsedResult = SelectedImagesSchema.parse(result);

			if (result && Array.isArray(result)) {
				const updatedImages = parsedResult;
				await setSelectedImages(updatedImages);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const removeImage = (imageUrl: string) => {
		if (selectedImages === undefined) throw new Error("No images selected");

		setIsLoading(true);

		const updatedImages = selectedImages.filter((url) => url !== imageUrl);
		setSelectedImages(updatedImages).finally(() => {
			setIsLoading(false);
		});
	};

	if (selectedImages === undefined || selectedImages.length === 0) {
		return (
			<Card padding="large">
				<Flex
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					style={{ width: "100%" }}
				>
					<SearchIcon size="xlarge" />
					<Button onClick={openDialog} isLoading={isLoading}>
						Select Images from Pixabay
					</Button>
				</Flex>
			</Card>
		);
	}

	return (
		<Card padding="large">
			<SelectedImagePreview
				selectedImages={selectedImages}
				onRemove={removeImage}
			/>
			<Button onClick={openDialog} isLoading={isLoading}>
				Re-choose Images
			</Button>
		</Card>
	);
}

export default PixabayImageField;
