import React from 'react';
import { Outlet } from 'react-router-dom';
import { Fragment } from 'react';
import { NavigationBar } from '../../components/widgets/navigation-bar/navigation-bar.component';

const Navigation = () => {
  return (
    <Fragment>
      <NavigationBar />
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
