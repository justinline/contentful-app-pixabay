import { locations } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import { useMemo } from "react";
import PixabaySearchDialog from "./locations/PixabaySearchDialog";
import PixabayImageField from "./locations/PixabayImageField";

const ComponentLocationSettings = {
	[locations.LOCATION_ENTRY_FIELD]: PixabayImageField,
	[locations.LOCATION_DIALOG]: PixabaySearchDialog,
};

const App = () => {
	const sdk = useSDK();

	const Component = useMemo(() => {
		for (const [location, component] of Object.entries(
			ComponentLocationSettings,
		)) {
			if (sdk.location.is(location)) {
				return component;
			}
		}
	}, [sdk.location]);

	return Component ? <Component /> : null;
};

export default App;
