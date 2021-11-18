import nc from 'next-connect';
import { MongoClient, ObjectId } from 'mongodb';
const handler = nc();

handler.get(async (req, res) => {
  const client = await MongoClient.connect(
    process.env.MONGODB_URI + 'Products?retryWrites=true&w=majority'
  );

  const db = client.db();

  const Products = db.collection('Products');

  const data = await Products.findOne(ObjectId(req.query.id));

  client.close();
  res.send(data);
});

export default handler;
