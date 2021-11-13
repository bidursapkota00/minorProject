import nc from 'next-connect';
import data from '../../util/data';
import { MongoClient } from 'mongodb';

const handler = nc();

handler.get(async (req, res) => {
  const client = await MongoClient.connect(
    'mongodb+srv://b2r:1234567890@cluster0.ihpge.mongodb.net/Products?retryWrites=true&w=majority'
  );

  const db = client.db();

  const Products = db.collection('Products');

  const data1 = await Products.insertMany(data.products);

  client.close();
  res.send(data1);
});

export default handler;
