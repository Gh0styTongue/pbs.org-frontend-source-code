const CS_ERROR_STUB = {
  meta: {
    error_code: 404001,
    error_message: 'Not found.',
  }
}

async function safeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(input, init);

    const originalJSON = response.json.bind(response);
    const bodyText = await response.clone().text();

    // For some reason we get 2xx success from some calls, but the call actually
    // failed. Then we get HTML that obviously can't be parsed. Some APIs we
    // depend on cannot be trusted to be truthful in their status codes........
    response.json = async () => {
      try {
        return await originalJSON();
      } catch (error) {
        if(response.status === 404) {
          console.error(`404 fetching ${input}`);
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            // We got a 404 response that's not from CS and so isn't JSON
            // Let's pretend it is so the rest of the application functions normally
            return new Promise((resolve) => resolve(CS_ERROR_STUB))
          }
        } else {
          console.error(`Error parsing JSON from URL: ${input}`);
          console.error(`Response body that caused the error: ${bodyText}`);
        }

        throw error;
      }
    };

    return response;
  } catch (error) {
    console.error(`Error fetching URL: ${input}`, error);
    throw error;
  }
}

export default safeFetch

/*

*/
