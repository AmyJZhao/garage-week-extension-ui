/*
* <license header>
*/

/* global fetch */

import allActions from './config.json'


export const getActionUrl = (action) => {
  return allActions[action]
}

/**
 *
 * Invokes a web action
 *
 * @param  {string} actionUrl
 * @param {object} headers
 * @param  {object} params
 *
 * @returns {Promise<string|object>} the response
 *
 */



export async function actionWebInvoke (actionUrl, authToken, params = {}, options = { method: 'POST' }) {
  const actionHeaders = {
    'Content-Type': 'application/json',
    authorization: `Bearer ${authToken}`
  }

  const fetchConfig = {
    headers: actionHeaders
  }

  if (window.location.hostname === 'localhost') {
    actionHeaders['x-ow-extra-logging'] = 'on'
  }

  fetchConfig.method = options.method.toUpperCase()

  if (fetchConfig.method === 'GET') {
    actionUrl = new URL(actionUrl)
    Object.keys(params).forEach(key => actionUrl.searchParams.append(key, params[key]))
  } else if (fetchConfig.method === 'POST') {
    fetchConfig.body = JSON.stringify(params)
  }

  const resp = await fetch(actionUrl, fetchConfig)
  if (!resp.ok) {
    throw new Error(
      'Request to ' + actionUrl + ' failed with status code ' + resp.status
    )
  }

  const data = await resp.json()
  return data
}


export const getModelsList = async (authToken, aemHost) => {
  return await actionWebInvoke(getActionUrl("aem-cf-console-admin-1/get-models-list"), authToken, {
    aemHost: `https://${aemHost}`
  });
}

export const getContentFragmentByModelFilter = async (authToken, aemHost, modelId) => {
  return await actionWebInvoke(getActionUrl("aem-cf-console-admin-1/get-content-fragments-by-model-filter"), authToken, {
    aemHost: `https://${aemHost}`,
    modelId,
  });
}
