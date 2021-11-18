import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
} from '@material-ui/core';
import NextLink from 'next/link';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { Store } from '../util/Store';
import { useRouter } from 'next/router';

import { MongoClient } from 'mongodb';

export default function Home(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { products } = props;
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of Stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => addToCartHandler(product)}
                  >
                    Add To Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const client = await MongoClient.connect(
    process.env.MONGODB_URI + 'Products'
  );

  const db = client.db();

  const Products = db.collection('Products');

  const data = await Products.find({}).toArray();

  client.close();

  const products = data.map((obj) => {
    const _id = JSON.parse(JSON.stringify(obj._id));
    const name = JSON.parse(JSON.stringify(obj.name));
    const slug = JSON.parse(JSON.stringify(obj.slug));
    const image = JSON.parse(JSON.stringify(obj.image));
    const category = JSON.parse(JSON.stringify(obj.category));
    const price = JSON.parse(JSON.stringify(obj.price));
    const brand = JSON.parse(JSON.stringify(obj.brand));
    const rating = JSON.parse(JSON.stringify(obj.rating));
    const numReviews = JSON.parse(JSON.stringify(obj.numReviews));
    const countInStock = JSON.parse(JSON.stringify(obj.countInStock));
    const description = JSON.parse(JSON.stringify(obj.description));
    return {
      _id,
      name,
      slug,
      image,
      category,
      price,
      brand,
      rating,
      numReviews,
      countInStock,
      description,
    };
  });
  return {
    props: { products },
    // revalidate: 10,
  };
}
