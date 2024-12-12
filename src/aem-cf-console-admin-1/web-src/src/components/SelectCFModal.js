/*
 * <license header>
 */
// https://experience.adobe.com/?ext=https://localhost:9080&devMode=true&repo=author-p7452-e733061.adobeaemcloud.com#/@sitesinternal/aem/cf/editor/editor/content%2Fdam%2Fbturchyk%2Fyou-and-whose-army%2Fnew-thing-489?appId=aem-cf-editor
import React, { useState, useEffect } from 'react'
import { attach } from "@adobe/uix-guest"
import {
  Flex,
  Form,
  ProgressCircle,
  Provider,
  Content,
  defaultTheme,
  Text,
  TextField,
  ButtonGroup,
  Button,
  Heading,
  View,
  ComboBox,
  Item,
  IllustratedMessage
} from '@adobe/react-spectrum'
import NotFound from '@spectrum-icons/illustrations/NotFound';
import {Card, CardView, WaterfallLayout} from '@react-spectrum/card';
import models from './models.json'
import cfFragments from './fragments.json'
import { extensionId } from "./Constants"
import {
  getContentFragmentByModelFilter,
  getModelsList
} from '../utils';


function renderEmptyState() {
  return (
    <IllustratedMessage>
      <NotFound />
      <Heading>No results</Heading>
      <Content>No content fragments of the selected model found.</Content>
    </IllustratedMessage>
  );
}
export default function SelectCFModal () {
  // Fields
  const [guestConnection, setGuestConnection] = useState()
  let [modelId, setModelId] = useState(null);
  const layout = new WaterfallLayout();
  let [selectedKeys, setSelectedKeys] = useState([]);
  let [loadingCF, setLoadingCF] = useState('idle');
  let [cfModels, setCFModels] = useState([]);
  let [fragments, setFragments] = useState([]);
  useEffect(() => {
    (async () => {
      const guestConnection = await attach({ id: extensionId });
      const auth = guestConnection.sharedContext.get("auth");
      const host = guestConnection.sharedContext.get("aemHost");
      console.log("authauthauthauth", auth, host, guestConnection.sharedContext);
      const modelsList = await getModelsList(auth.imsToken, host);
      console.log(modelsList.items.length);
      console.log(modelsList.items.slice(0, 10));
      setCFModels(modelsList.items);
      setGuestConnection(guestConnection);
    })();
  }, [])

  useEffect(() => {
    if (modelId && guestConnection) {
      (async () => {
        const auth = guestConnection.sharedContext.get("auth");
        const host = guestConnection.sharedContext.get("aemHost");
        const filteredContentFragments = await await getContentFragmentByModelFilter(auth.imsToken, host, modelId);
        console.log(filteredContentFragments.items.slice(4));
        setFragments(filteredContentFragments.items);
        setLoadingCF('idle');
      })();
    }
  }, [modelId, guestConnection]);

  return (
    <Provider theme={defaultTheme} colorScheme='light'>
      <Content width="100%" height="100%">
      {!guestConnection || !cfModels? (
        <Flex alignItems="center" height="100%" justifyContent="center" left={0} position="absolute" top={0} width="100%" zIndex={1001}>
        <ProgressCircle isIndeterminate alignSelf="center" justifySelf="center" />
        </Flex>
      ) : (
        <>
      <Flex width="98%" alignItems="center" justifyContent="space-between" marginBottom="size-400">
        <ComboBox
          width="40%"
          margin-left="24px"
          defaultItems={cfModels}
          label="Select content fragment model"
          onSelectionChange={id => {setLoadingCF('loading'); setModelId(id); }}>
            {
              item => (
                <Item textValue={item.name}>
                  <Text>{item.name}</Text>
                  <Text slot="description">{item.path}</Text>
                </Item>
              )
            }
          </ComboBox>
          <ButtonGroup>
            <Button variant="accent">Send to Gen Studio</Button>
          </ButtonGroup>
        </Flex>
          {
            modelId ? (
              <>
              <Text>Select content fragments</Text>
              <CardView selectionMode={'multiple'} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} items={fragments} layout={layout} width="100%" height="75%" renderEmptyState={renderEmptyState} loadingState={loadingCF}>
              {(item) => (
                <Card key={item.id}>
                  {/*<Image src={item.fields.filter(e => e.type == "content-reference")[0].values[0]}/> */}
                  <Heading>{item.title}</Heading>
                  <Content>
                  {item.fields.filter(e => e.name == "claimText").length != 0 ? (
                    <Text>Claim text: {item.fields.filter(e => e.name == "claimText")[0].values.length != 0 ? item.fields.filter(e => e.name == "claimText")[0].values[0] : 
                    "None"} </Text>) : ""}
                  </Content>
                </Card>
              )}
        </CardView>
        </>
            ) : ""
          }
          </>
      )}
      </Content>
    </Provider>
  )
}
