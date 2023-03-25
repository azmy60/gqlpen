# gqlpen

This is a monorepo of gqlpen, a minimal (and might be just another) graphql IDE that works in the browser as an extension, or as a static html page.

The main focus of this project is to build (another) graphql IDE that is minimal, in other word, simple, and... uhmm... simple! 

![image](https://user-images.githubusercontent.com/38707148/227720271-56ce0d68-9547-4e5c-aeb9-70d58c26e692.png)

I started this project because I had used a couple of graphql IDE like graphiql, altair, postman, and none of them really satisfy me.

Graphiql and altair are great but they have an issue with CORS. With altair, you have to download the desktop version to fix it but the search bar is kind of difficult to use, especially with huge schema. It's way easier to use the native chrome search bar instead (ctrl + f). Postman doesn't have issue with CORS, but it's an overkill for my workflow.

If you would like to suggest any ideas, or contribute, feel free to do so!

## Development

You can start a dev server by running `yarn app:dev`. The main app is located at [packages/gqlpen-app](https://github.com/azmy60/gqlpen/tree/main/packages/gqlpen-app). The web extension (for chrome) is at [packages/gqlpen-web-ext](https://github.com/azmy60/gqlpen/tree/main/packages/gqlpen-web-ext).

In the future, I want to make a proxy server to address the CORS issue. This can be easily done with express server or python, but I'm thinking of using rust, but I'm still not good at it ;-; I'm halfway learning rust, so hopefully I can start building it pretty soon.
