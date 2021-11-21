import { app } from 'electron';
import serve from 'electron-serve';

if (process.env.NODE_ENV === 'production') {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}
