import jwt from 'jsonwebtoken';
import { env } from './env.js';
import { AppError } from '../utils/AppError.js';

const certUrl = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
let certCache = { expiresAt: 0, certs: {} };

async function getFirebaseCerts() {
  if (Date.now() < certCache.expiresAt && Object.keys(certCache.certs).length) {
    return certCache.certs;
  }

  const response = await fetch(certUrl);
  if (!response.ok) throw new AppError('Unable to fetch Firebase public certificates', 503);

  const cacheControl = response.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAgeSeconds = maxAgeMatch ? Number(maxAgeMatch[1]) : 3600;

  certCache = {
    expiresAt: Date.now() + maxAgeSeconds * 1000,
    certs: await response.json()
  };

  return certCache.certs;
}

export async function verifyFirebaseToken(idToken) {
  if (!env.firebase.projectId) {
    throw new AppError('Firebase project is not configured on the API server', 500);
  }

  const decodedHeader = jwt.decode(idToken, { complete: true });
  const kid = decodedHeader?.header?.kid;
  if (!kid || decodedHeader.header.alg !== 'RS256') {
    throw new AppError('Invalid Firebase token header', 401);
  }

  const certs = await getFirebaseCerts();
  const cert = certs[kid];
  if (!cert) throw new AppError('Firebase token signing key not found', 401);

  return jwt.verify(idToken, cert, {
    algorithms: ['RS256'],
    audience: env.firebase.projectId,
    issuer: `https://securetoken.google.com/${env.firebase.projectId}`
  });
}
