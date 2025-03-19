import type {MetadataRoute} from "next";
import logo from './logo.png'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Predict Game",
    short_name: "Predict Game",
    description: "Predict Game",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    // icons: [
    //   {
    //     src: '/prediction-logo.png',
    //     sizes: "192x192",
    //     type: "image/png",
    //     purpose: "maskable",
    //   },
    // ],
  };
}
