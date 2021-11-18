import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import useStyles from '../util/styles';
import NextLink from 'next/link';
import { Store } from '../util/Store';
import router from 'next/router';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import dynamic from 'next/dynamic';

function Shipping() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
  }, []);
  const classes = useStyles();
  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set('userInfo', { fullName, address, city, postalCode, country });
    router.push('/');
  };
  return (
    <div>
      <Layout title="Shipping">
        <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
          <Typography variant="h1" component="h1">
            Shipping
          </Typography>
          <List>
            <ListItem>
              <Controller
                name="fullName"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  minLength: 3,
                }}
                render={({ field }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="fullName"
                    label="Full Name"
                    error={Boolean(errors.fullName)}
                    helperText={
                      errors.fullName
                        ? errors.fullName.type === 'minLength'
                          ? 'Full Name is short'
                          : 'Full Name is required'
                        : ''
                    }
                    {...field}
                  ></TextField>
                )}
              ></Controller>
            </ListItem>
            <ListItem>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                color="primary"
              >
                Continue
              </Button>
            </ListItem>
          </List>
        </form>
      </Layout>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Shipping), { ssr: false });
