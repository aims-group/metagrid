/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, waitFor, fireEvent } from '@testing-library/react';

import NavBar, { Props } from './index';
import { server, rest } from '../../test/setup-env';
import { apiRoutes } from '../../test/server-handlers';

const defaultProps: Props = {
  activeProject: { name: 'test1' },
  numCartItems: 0,
  numSavedSearches: 0,
  onSearch: jest.fn(),
  onProjectChange: jest.fn(),
};

it('renders LeftMenu and RightMenu components', async () => {
  const { getByTestId } = render(
    <Router>
      <NavBar {...defaultProps} />
    </Router>
  );
  await waitFor(() => expect(getByTestId('left-menu')).toBeTruthy());
  expect(getByTestId('right-menu')).toBeTruthy();
});

it('renders error message when projects can"t be fetched', async () => {
  server.use(
    rest.get(apiRoutes.metagrid, (_req, res, ctx) => {
      return res(ctx.status(404));
    })
  );
  const { getByRole } = render(
    <Router>
      <NavBar {...defaultProps} />
    </Router>
  );

  const alertComponent = await waitFor(() =>
    getByRole('img', { name: 'close-circle' })
  );
  expect(alertComponent).toBeTruthy();
});

it('opens the drawer onClick and closes with onClose', async () => {
  const { getByRole, getByTestId } = render(
    <Router>
      <NavBar {...defaultProps} />
    </Router>
  );
  await waitFor(() => expect(getByTestId('left-menu')).toBeTruthy());
  expect(getByTestId('right-menu')).toBeTruthy();

  // Open drawer
  const drawerBtn = getByRole('img', { name: 'menu-unfold' });
  expect(drawerBtn).toBeTruthy();
  fireEvent.click(drawerBtn);

  // Close drawer by clicking on mask
  // It is not best practice to use querySelect to query elements. However, this
  // test case is an exception because the Ant Design Drawer API doesn't expose
  // a way to query for the drawer mask using role, text, etc. Also, we cannot
  // use the react-testing-library container method because the drawer renders
  // outside of the component dynamically, so document has to be used instead.
  // Source: https://testing-library.com/docs/guide-which-query#manual-queries
  const drawerMask = document.querySelector('div.ant-drawer-mask');
  expect(drawerMask).not.toBeNull();
  if (drawerMask !== null) {
    fireEvent.click(drawerMask);
  }
});
