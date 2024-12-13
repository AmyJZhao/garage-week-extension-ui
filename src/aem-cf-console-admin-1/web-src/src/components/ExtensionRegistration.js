/*
 * <license header>
 */


import { generatePath } from "react-router";

import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import { extensionId } from "./Constants";

function ExtensionRegistration() {
  const init = async () => {
    const guestConnection = await register({
      id: extensionId,
      methods: {
        prompt: {
          selectAddOn: async (appExtensionId) => {
            const adddOnId = appExtensionId+"-claims-addon-select";
            return {
              id: adddOnId,
              label: "Claims",
              onClick: async () => {
                const hostInfo = await guestConnection.host.api.dialogs.open(`${adddOnId}`);
              },
            }
          },
          loadAddOn: async (appExtensionId) => {
            return {
              id: `${appExtensionId}-claims-addon-app`,
              label: "Claims",
              header: "Claims",
              url: '/#/claims-list',
              extensionId: appExtensionId,
            };
          },
        }
      },
    });
  };
  init().catch(console.error);

  return <Text>IFrame for integration with Host (AEM)...</Text>
}

export default ExtensionRegistration;
