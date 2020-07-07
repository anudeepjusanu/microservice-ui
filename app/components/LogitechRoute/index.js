/* eslint-disable no-unused-vars */
import React from 'react';
import { Route } from 'react-router-dom';
import Layout from 'components/Layout';
import HomePage from './../../containers/HomePage';

const LogitechRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => (
            <div>
                <Layout {...props} {...rest}>
                    <Component {...props} {...rest} />
                </Layout>
            </div>
        )}
    />
);

export default LogitechRoute;
