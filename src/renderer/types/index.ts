import 'next';
import 'next/app';
import { AppProps } from 'next/app';

export type WindowName = 'main' | 'settings';

export type PageProps = {
  windowName: WindowName;
};

declare module 'next' {
  // export type AppProps = Omit<NextAppProps<PageProps>, 'pageProps'> & {
  //   pageProps: PageProps;
  // };

  export type PageFC = NextPage<PageProps>;
}

declare module 'next/app' {
  export type AppPageProps = Omit<AppProps<PageProps>, 'pageProps'> & {
    pageProps: PageProps;
  };
}
