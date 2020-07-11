import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import api from "./api/client";

const HomeRoute = () => {
  const [loggedIn, setLoggedIn] = useState(2);
  const [slug, setSlug] = useState('');

  useEffect(() => {
    api.get('/api/current_account/').then(
      ({ data }) => {
        setLoggedIn(1);
        setSlug(data.slug);
      },
      () => {
        setLoggedIn(0);
      },
    )
  });

  switch (loggedIn) {
    case 0:
      return <Redirect to="/login/" />
    case 1:
      return <Redirect to={`/accounts/${slug}/`} />
    case 2:
      return null;
  }
};

export default HomeRoute;
