import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { mockCma, mockSdk } from "../../test/mocks";
import PixabayImageField from "./PixabayImageField";
import * as reactAppsToolkit from "@contentful/react-apps-toolkit";

vi.mock("@contentful/react-apps-toolkit", () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
  useFieldValue: vi.fn(),
}));

describe("PixabayImageField component", () => {
  it("Component defaults to empty state", () => {
    const mocked = vi.mocked(reactAppsToolkit.useFieldValue);

    mocked.mockReturnValue([[], async () => []]);

    render(<PixabayImageField />);

    const button = screen.getByRole("button", {
      name: "Select Images from Pixabay",
    });

    expect(button).toBeDefined();
  });
});
