import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { mockCma, mockSdk } from "../../test/mocks";
import PixabaySearchDialog from "./PixabaySearchDialog";
import { server } from "../../tests/server";
import { http, HttpResponse } from "msw";

vi.mock("@contentful/react-apps-toolkit", () => ({
	useSDK: () => mockSdk,
	useCMA: () => mockCma,
}));

describe("PixabaySearchDialog component", () => {
	it("Search form elements exists on open", () => {
		render(<PixabaySearchDialog />);

		const searchField = screen.getByPlaceholderText("Search for images...");
		const searchButton = screen.getByRole("button", {
			name: /search/i,
		});

		expect(searchField).toBeDefined();
		expect(searchButton).toBeDefined();
	});

	it("displays search results after a successful API call", async () => {
		// Mock the Pixabay API response
		server.use(
			http.get("https://pixabay.com/api/", () => {
				return HttpResponse.json({
					hits: [
						{
							id: 1,
							webformatURL: "https://example.com/image1.jpg",
							tags: "nature, landscape",
						},
						{
							id: 2,
							webformatURL: "https://example.com/image2.jpg",
							tags: "city, urban",
						},
					],
				});
			}),
		);

		render(<PixabaySearchDialog />);

		const searchField = screen.getByPlaceholderText("Search for images...");
		const searchButton = screen.getByRole("button", {
			name: /search/i,
		});

		fireEvent.change(searchField, { target: { value: "test query" } });
		fireEvent.click(searchButton);

		// Wait for the images to be displayed
		await waitFor(() => {
			const images = screen.getAllByRole("img");
			expect(images).toHaveLength(2);
		});

		// Check if the images and their tags are displayed
		const image1 = screen.getByAltText("nature, landscape");
		const image2 = screen.getByAltText("city, urban");
		expect(image1).toBeDefined();
		expect(image2).toBeDefined();
	});
});
