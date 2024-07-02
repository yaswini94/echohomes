import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If you plan to modify Ant Design variables:
// const modifyVars = {
//   'primary-color': '#1DA57A',  // Change primary color to green
//   'link-color': '#1DA57A',     // Link color to green
//   'border-radius-base': '2px', // Border radius to 2px
// };

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/': 'http://localhost:3001'
      // '/api': {
      //   target: 'http://localhost:3001',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '')
      // }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // modifyVars: modifyVars,
        globalVars: {
          'hack': `true; @import (reference) "${require.resolve('antd/lib/style/color/colorPalette.less')}";`
        }
      }
    }
  },
});

