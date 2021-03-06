const { nanoid } = require('nanoid');
const UrlModel = require('../models/url.model');

exports.getUrl = async (req, res) => {
  const { slug } = req.params;
  // check if slug exists
  const foundSlug = await UrlModel.findOne({ slug });
  // if no slug exists, create one
  if (!foundSlug || foundSlug.length === 0) {
    const fullUrl = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    res.status(404).json({ message: 'URL not found.', body: { slug, url: fullUrl } });
  } else {
    res.status(302).redirect(foundSlug.url);
  }
};

exports.postUrl = async (req, res) => {
  const { url } = req.body;
  let { slug } = req.body;
  // check if slug provided, create new one if not.
  if (slug && slug.length !== 5) {
    res.status(422).json({ message: 'Slug length must be 5', body: { slug: '', url: '' } });
  }

  if (!slug) {
    slug = nanoid(5);
  }

  slug = slug.toLocaleLowerCase();
  // check if slug exists
  const foundSlug = await UrlModel.find({ slug });
  // if no slug exists, create one
  if (!foundSlug || foundSlug.length === 0) {
    const newUrl = new UrlModel(
      {
        slug,
        url,
      },
    );
    const response = await newUrl.save();
    res.status(200).json({ message: 'Creation successful!', body: response });
  } else {
    res.status(409).json({ message: 'Resource already exists.', body: { slug: '', url: '' } });
  }
};
