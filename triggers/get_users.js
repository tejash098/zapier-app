const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/users/`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    params: {
    },
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const results = response.json.map((result)=>({
      id: result.user_id,
      user_id: result.user_id,
      full_name: result.full_name
    }))
    return results;
  });
};

module.exports = {
  operation: {
    perform: perform,
    canPaginate: true,
    sample: {
      id: '7424309824034181121',
      user_id: '7424309824034181121',
      full_name: 'Tejash kumar singh'
    },
    outputFields: [
      { key: 'id', label: 'Id' },
      { key: 'user_id', label: 'User Id' },
      { key: 'full_name', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'profile_id', label: 'Profile Id' },
    ],
  },
  display: {
    description: 'Triggers when Users select Owner Id from Dropdown',
    hidden: true,
    label: 'Get User',
  },
  key: 'get_users',
  noun: 'User',
};
