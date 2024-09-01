import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { mockCma, mockSdk } from "../../test/mocks";
import PixabaySearchDialog from "./PixabaySearchDialog";

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
});
