import type React from "react";
import { Flex } from "@contentful/f36-components";
import { CloseIcon } from "@contentful/f36-icons";

interface SelectedImagePreviewProps {
	selectedImages: string[];
	onRemove: (imageUrl: string) => void;
	showRemoveButton?: boolean;
}

const SelectedImagePreview: React.FC<SelectedImagePreviewProps> = ({
	selectedImages,
	onRemove,
	showRemoveButton = true,
}) => {
	return (
		<Flex
			gap="spacingM"
			style={{
				overflowX: "auto",
				overflowY: "hidden",
				whiteSpace: "nowrap",
				padding: "1rem",
			}}
		>
			{selectedImages.map((imageUrl) => (
				<div key={imageUrl} style={{ position: "relative" }}>
					<img
						src={imageUrl}
						alt="Selected"
						style={{
							aspectRatio: "4 / 3",
							objectFit: "contain",
							width: "4rem",
							minWidth: "4rem",
						}}
					/>
					{showRemoveButton && (
						<button
							aria-label="Remove image"
							type="button"
							onClick={() => onRemove(imageUrl)}
							style={{
								position: "absolute",
								top: "-0.25rem",
								right: "-0.25rem",
								width: "1.25rem",
								height: "1.25rem",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: "50%",
								backgroundColor: "white",
								border: "1px solid black",
								cursor: "pointer",
								padding: 0,
							}}
						>
							<CloseIcon size="tiny" variant="negative" />
						</button>
					)}
				</div>
			))}
		</Flex>
	);
};

export default SelectedImagePreview;
