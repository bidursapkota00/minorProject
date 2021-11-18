import bcrypt from 'bcryptjs';
import nc from 'next-connect';
import { MongoClient } from 'mongodb';
import { signToken } from '../../../util/auth';

const handler = nc();

handler.post(async (req, res) => {
  const client = await MongoClient.connect(
    process.env.MONGODB_URI + 'Products?retryWrites=true&w=majority'
  );

  const db = client.db();

  const Products = db.collection('User');

  const user = await Products.findOne({ email: req.body.email });

  client.close();
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).send({ message: 'Invalid email or password' });
  }
});

export default handler;
