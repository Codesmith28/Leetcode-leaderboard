import styles from "@/styles/Home.module.css";
import { Button } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import Layout from "./Layout";
import Groups from "./components/Groups/Groups";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>LeetCode LeaderBoard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="color-scheme" content="dark " />
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
            cwindow.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('onfig', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
          `,
          }}
        />
      </Head>
      <main className={styles.pg}>
        <Layout>
          <div className={styles.groups}>
            <Groups type={"Institute"} />
            <Groups type={"Institute"} />
            <Groups type={"Open"} />
            <Groups type={"Institute"} />
            <Groups type={"Institute"} />
          </div>
        </Layout>
      </main>
    </>
  );
}
