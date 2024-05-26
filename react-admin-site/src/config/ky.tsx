import ky from 'ky';

export const apiInstance = ky.create({
  prefixUrl: 'http://localhost:8000',
});
