# gqlpen

gqlpen is a GraphQL IDE designed to be minimal and simple, with the option to use it as a browser extension or a static HTML page.

The main focus of this project is to build (another) graphql IDE that is minimal, in other word, simple, and... uhmm... here is the photo... 

![image](https://user-images.githubusercontent.com/38707148/227720271-56ce0d68-9547-4e5c-aeb9-70d58c26e692.png)

While there are several popular options such as GraphiQL, Altair, and Postman, I found that they did not fully meet my needs.

GraphiQL and Altair can have CORS issues, which can be frustrating to work around, and Postman was too complex for my workflow.

If you have any suggestions or would like to contribute, feel free to do so!

## Development

You can start a dev server by running `yarn app:dev`. The main app is located at [packages/gqlpen-app](https://github.com/azmy60/gqlpen/tree/main/packages/gqlpen-app). The web extension (for chrome) is at [packages/gqlpen-web-ext](https://github.com/azmy60/gqlpen/tree/main/packages/gqlpen-web-ext).

This project does not resolve the CORS issue yet, so in the future, I want to make a proxy server to address it.
