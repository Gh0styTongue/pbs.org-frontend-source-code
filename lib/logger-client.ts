/**
 * Helper function for client components to log metrics.
 * Usage: clientMetricLogger('pbs:feature:function', 'some message')
 * @param {string} namespace - should preceed related metric messages. e.g. pbs:passport:activation
 * @param {string} message - the metric message to log
 * @returns {Promise<void>}
*/
const clientMetricLogger = async (namespace: string, message: string,): Promise<void> => {
  const url = '/api/metric/';
  const body = { namespace, message };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if(!response.ok) {
    throw new Error('Network response was not ok');
  }
}

export { clientMetricLogger };
