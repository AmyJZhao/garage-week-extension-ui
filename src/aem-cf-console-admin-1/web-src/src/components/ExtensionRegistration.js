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
        headerMenu: {
          getButtons() {
            return [
              // YOUR HEADER BUTTONS CODE SHOULD BE HERE
              {
                'id': 'select-cf',
                'label': 'Select CF',
                'icon': 'OpenIn',
                onClick() {
                  const modalURL = "/index.html#/select-cf-modal";
                  console.log("Modal URL: ", modalURL);

                  guestConnection.host.modal.showUrl({
                    title: "Select CF",
                    url: modalURL,
                    fullscreen: true
                  });
                },
              },
            ];
          },
        },
      },
    });
  };
  init().catch(console.error);

  return <Text>IFrame for integration with Host (AEM)...</Text>
}

export default ExtensionRegistration;
