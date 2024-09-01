import type { FieldAppSDK } from "@contentful/app-sdk";
import { Button, Card, Flex } from "@contentful/f36-components";
import { SearchIcon } from "@contentful/f36-icons";
import { useFieldValue, useSDK } from "@contentful/react-apps-toolkit";
import { useEffect } from "react";
import { z } from "zod";

const SelectedImagesSchema = z.array(z.string());

function PixabayImageField() {
	const sdk = useSDK<FieldAppSDK>();
	const [selectedImages, setSelectedImages] =
		useFieldValue<string[]>("pixabayurl");

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

		const parsedResult = SelectedImagesSchema.parse(result);

		if (result && Array.isArray(result) && selectedImages !== undefined) {
			const updatedImages = parsedResult;
			setSelectedImages(updatedImages);
			sdk.field.setValue(updatedImages);
		}
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
					<Button onClick={openDialog}>Select Images from Pixabay</Button>
				</Flex>
			</Card>
		);
	}

	return (
		<Card padding="large">
			<ul>
				{selectedImages.map((image) => (
					<li key={image}>{image}</li>
				))}
			</ul>
			<Button onClick={openDialog}>Re-choose Images</Button>
		</Card>
	);
}

export default PixabayImageField;
