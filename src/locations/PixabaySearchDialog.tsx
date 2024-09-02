import type { DialogAppSDK } from "@contentful/app-sdk";
import {
	Button,
	Flex,
	Grid,
	TextInput,
	Checkbox,
	Card,
	Text,
} from "@contentful/f36-components";
import { SearchIcon, ImageIcon } from "@contentful/f36-icons";
import tokens from "@contentful/f36-tokens";
import { useSDK } from "@contentful/react-apps-toolkit";
import { useState } from "react";
import { z } from "zod";
import SelectedImagePreview from "../components/SelectedImagePreview";

const PixabayImageSchema = z.object({
	id: z.number(),
	webformatURL: z.string(),
	tags: z.string(),
});

const PixabaySearchResultsSchema = z.object({
	hits: z.array(PixabayImageSchema),
});

type PixabayImage = z.infer<typeof PixabayImageSchema>;

function PixabaySearchDialog() {
	const sdk = useSDK<DialogAppSDK>();
	const [searchResults, setSearchResults] = useState<PixabayImage[] | "ERROR">(
		[],
	);
	// Ultimately went with a hashmap to store image urls which is easier/more performant to work with than the final result (array of strings)
	const [selectedImageUrls, setSelectedImageUrls] = useState<
		Record<PixabayImage["webformatURL"], true>
	>({});

	const amountOfImages = Object.keys(selectedImageUrls).length;
	const arrayOfUrls = Object.keys(selectedImageUrls);

	const onCheckImage = (imageUrl: string) =>
		setSelectedImageUrls((prev) => {
			const newState = { ...prev };
			if (newState[imageUrl] !== undefined) delete newState[imageUrl];
			else newState[imageUrl] = true;

			return newState;
		});

	const confirmSelection = () => {
		sdk.close(arrayOfUrls);
	};

	const toolbar =
		amountOfImages === 0 ? (
			<SearchForm setSearchResults={setSearchResults} />
		) : (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					confirmSelection();
				}}
			>
				<Flex gap="spacingM" alignItems="center">
					<Button
						type="submit"
						isDisabled={amountOfImages === 0}
						style={{ minWidth: "12rem" }}
					>
						Attach {amountOfImages} images
					</Button>
					<SelectedImagePreview
						selectedImages={arrayOfUrls}
						onRemove={onCheckImage}
					/>
				</Flex>
			</form>
		);

	return (
		<Flex
			flexDirection="column"
			gap="spacingM"
			padding="spacingL"
			// Enables us to create a scrollable flex layout, since we don't have control over the dialog "root" afaict
			style={{
				position: "absolute",
				top: "0",
				left: "0",
				right: "0",
				bottom: "0",
			}}
		>
			<div style={{ overflowY: "auto", flexGrow: 1 }}>
				<SearchResults
					searchResults={searchResults}
					selectedImageUrls={Object.keys(selectedImageUrls)}
					onCheckImage={onCheckImage}
				/>
			</div>
			<div>{toolbar}</div>
		</Flex>
	);
}

function SearchForm({
	setSearchResults,
}: { setSearchResults: (searchResults: PixabayImage[] | "ERROR") => void }) {
	const [searchQuery, setSearchQuery] = useState("");

	const searchPixabay = async () => {
		const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

		const searchParams = new URLSearchParams({
			key: PIXABAY_API_KEY,
			q: searchQuery,
			image_type: "photo",
		});

		try {
			const response = await fetch(
				`https://pixabay.com/api/?${searchParams.toString()}`,
			);
			const data = await response.json();
			const { hits } = PixabaySearchResultsSchema.parse(data);

			setSearchResults(
				hits.map((hit) => ({
					id: hit.id,
					webformatURL: hit.webformatURL,
					tags: hit.tags,
				})),
			);
		} catch (error) {
			setSearchResults("ERROR");
		}
	};

	return (
		<form
			id="pixabay-search-form"
			onSubmit={(e) => {
				e.preventDefault();
				searchPixabay();
			}}
		>
			<Flex gap="spacingS">
				<TextInput
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search for images..."
				/>
				<Button type="submit" startIcon={<SearchIcon />}>
					Search
				</Button>
			</Flex>
		</form>
	);
}

function SearchResults({
	searchResults,
	selectedImageUrls,
	onCheckImage,
}: {
	searchResults: PixabayImage[] | "ERROR";
	selectedImageUrls: string[];
	onCheckImage: (imageUrl: string) => void;
}) {
	if (searchResults === "ERROR") {
		return <p>Error fetching images</p>;
	}

	if (searchResults.length === 0)
		return (
			<Card padding="large" style={{ height: "100%" }}>
				<Flex
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					gap="spacingM"
					style={{ width: "100%", height: "100%" }}
				>
					<ImageIcon size="xlarge" />
					<Text>Use the form to search for images</Text>
				</Flex>
			</Card>
		);

	return (
		<Card padding="large">
			<Grid columns="1fr 1fr 1fr" rowGap="spacingM" columnGap="spacingM">
				{searchResults.map((image) => (
					<SearchResult
						key={image.id}
						image={image}
						checked={selectedImageUrls.includes(image.webformatURL)}
						onChange={() => onCheckImage(image.webformatURL)}
					/>
				))}
			</Grid>
		</Card>
	);
}

function SearchResult({
	image,
	checked,
	onChange,
}: { image: PixabayImage; checked: boolean; onChange: () => void }) {
	return (
		<label htmlFor={`image-${image.id}`} key={image.id}>
			<figure style={{ position: "relative", height: "min-content" }}>
				{/* Placeholder to stop layout shift/jank when loading images */}
				<div
					style={{
						width: "100%",
						aspectRatio: "4 / 3",
						backgroundColor: tokens.gray300,
						position: "relative",
					}}
				>
					<img
						src={image.webformatURL}
						alt={image.tags}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
							position: "absolute",
							top: "0",
							left: "0",
						}}
					/>
					<Checkbox
						id={`image-${image.id}`}
						aria-label={`Select image with tags: ${image.tags}`}
						isChecked={checked}
						onChange={onChange}
						style={{
							position: "absolute",
							top: "-0.25rem",
							left: "-0.25rem",
							padding: "0.25rem",
							background: "white",
							borderRadius: "4px",
						}}
					/>
				</div>
				<figcaption
					style={{
						position: "absolute",
						left: "0.5rem",
						bottom: "0.5rem",
						right: "0.5rem",
						background: "white",
						padding: "0.25rem 0.5rem",
						borderRadius: "4px",
					}}
				>
					tags: <i>{image.tags}</i>
				</figcaption>
			</figure>
		</label>
	);
}

export default PixabaySearchDialog;
