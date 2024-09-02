import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SelectedImagePreview from "./SelectedImagePreview";

describe("SelectedImagePreview", () => {
	const mockSelectedImages = [
		"https://example.com/image1.jpg",
		"https://example.com/image2.jpg",
	];
	const mockOnRemove = vi.fn();

	it("renders selected images", () => {
		render(
			<SelectedImagePreview
				selectedImages={mockSelectedImages}
				onRemove={mockOnRemove}
			/>,
		);
		const images = screen.getAllByRole("img") as HTMLImageElement[];
		expect(images.length).toBe(2);
		expect(images[0].src).toBe(mockSelectedImages[0]);
		expect(images[1].src).toBe(mockSelectedImages[1]);
	});

	it("calls onRemove when remove button is clicked", () => {
		render(
			<SelectedImagePreview
				selectedImages={mockSelectedImages}
				onRemove={mockOnRemove}
			/>,
		);
		const removeButtons = screen.getAllByRole("button", {
			name: "Remove image",
		});
		fireEvent.click(removeButtons[0]);
		expect(mockOnRemove).toHaveBeenCalledWith(mockSelectedImages[0]);
	});

	it("does not show remove buttons when showRemoveButton is false", () => {
		render(
			<SelectedImagePreview
				selectedImages={mockSelectedImages}
				onRemove={mockOnRemove}
				showRemoveButton={false}
			/>,
		);
		const removeButtons = screen.queryAllByRole("button", { name: "X" });
		expect(removeButtons.length).toBe(0);
	});

	it("allows horizontal scrolling when content overflows", () => {
		const manyImages = [...Array(20)].map(
			(_, index) => `https://example.com/image${index}.jpg`,
		);
		const { container } = render(
			<SelectedImagePreview
				selectedImages={manyImages}
				onRemove={mockOnRemove}
			/>,
		);
		const flexContainer = container.firstChild as HTMLElement;
		expect(flexContainer.style.overflowX).toBe("auto");
		expect(flexContainer.style.whiteSpace).toBe("nowrap");
	});
});
