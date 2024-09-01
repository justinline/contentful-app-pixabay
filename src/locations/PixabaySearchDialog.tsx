import type { DialogAppSDK } from "@contentful/app-sdk";
import {
	Button,
	Flex,
	Grid,
	TextInput,
	Checkbox,
	Paragraph,
	Card,
	Text,
} from "@contentful/f36-components";
import { SearchIcon, ImageIcon } from "@contentful/f36-icons";
import { useSDK } from "@contentful/react-apps-toolkit";
import { useState } from "react";
import { z } from "zod";

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
	const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>([]);

	const toggleImageSelection = (imageUrl: string) => {
		setSelectedImageUrls((prev) =>
			prev.includes(imageUrl)
				? prev.filter((url) => url !== imageUrl)
				: [...prev, imageUrl],
		);
	};

	const confirmSelection = () => {
		sdk.close(selectedImageUrls);
	};

	const toolbar =
		selectedImageUrls.length === 0 ? (
			<SearchForm setSearchResults={setSearchResults} />
		) : (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					confirmSelection();
				}}
			>
				<Button type="submit" isDisabled={selectedImageUrls.length === 0}>
					Attach {selectedImageUrls.length} images
				</Button>
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
					selectedImageUrls={selectedImageUrls}
					toggleImageSelection={toggleImageSelection}
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
	toggleImageSelection,
}: {
	searchResults: PixabayImage[] | "ERROR";
	selectedImageUrls: string[];
	toggleImageSelection: (imageUrl: string) => void;
}) {
	if (searchResults === "ERROR") {
		return <p>Error fetching images</p>;
	}

	if (searchResults.length === 0)
		return (
			<Card padding="large">
				<Flex
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					gap="spacingM"
					style={{ width: "100%" }}
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
						onChange={() => toggleImageSelection(image.webformatURL)}
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
				<img
					src={image.webformatURL}
					alt={image.tags}
					style={{
						width: "100%",
					}}
				/>
				<figcaption
					style={{
						position: "absolute",
						left: "0.25rem",
						bottom: "0.25rem",
						right: "0.25rem",
						background: "white",
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
