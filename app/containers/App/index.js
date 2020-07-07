/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Router, Route } from 'react-router-dom';

import history from 'utils/history';
import routes from 'routes';

import GlobalStyle from '../../global-styles';
import './styles.css';

const AppWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="Logitech"
        defaultTitle="Logitech"
      >
        <meta name="description" content="A Logitech application" />
      </Helmet>
      <Router history={history}>
        <Route>{routes}</Route>
      </Router>
      <GlobalStyle />
    </AppWrapper>
  );
}
