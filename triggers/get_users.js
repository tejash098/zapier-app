const perform = async (z, bundle) => {
  const options = {
    url: `${process.env.NGROK_URL}/users/`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    params: {
      page: bundle.meta.page + 1,
      items_per_page: 20,
      module: 'users',
    },
    removeMissingValuesFrom: {
      body: true,
      params: true,
    },
  };

  return z.request(options).then((response) => {
    const data = response.json;
    const results = data.results.map((result) => ({
      id: result.user_id,
      user_id: result.user_id,
      full_name: result.full_name,
      email: result.email,
      profile_id: result.profile_id,
    }));
    // You can do any parsing you need for results here before returning them

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
      full_name: 'Tejash kumar singh',
      email: 'F7NMCRTv7q5Ipu3YUHeOKyQJ5pbQVimu/EfbAf5BlOk=',
      profile_id: '7424309828828270593',
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
