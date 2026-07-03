const { RekognitionClient, RecognizeCelebritiesCommand } = require('@aws-sdk/client-rekognition');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { image } = req.body || {};
  if (!image) {
    res.status(400).json({ error: 'Missing image (base64) in request body' });
    return;
  }

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    res.status(500).json({ error: 'AWS credentials not configured on the server' });
    return;
  }

  const client = new RekognitionClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    const bytes = Buffer.from(image, 'base64');
    const command = new RecognizeCelebritiesCommand({ Image: { Bytes: bytes } });
    const result = await client.send(command);

    const celebrities = (result.CelebrityFaces || []).map(c => ({
      name: c.Name,
      id: c.Id,
      matchConfidence: c.MatchConfidence,
      urls: c.Urls || [],
    }));

    res.status(200).json({
      celebrities,
      unrecognizedFaces: (result.UnrecognizedFaces || []).length,
    });
  } catch (err) {
    console.error('Rekognition error:', err);
    res.status(502).json({ error: 'Amazon Rekognition request failed' });
  }
};
