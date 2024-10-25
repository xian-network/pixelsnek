export const getOwnedUidsQuery = async () => {
  return `
  query MyQuery {
      allStates(
        filter: {
          key: { startsWith: "con_pixel_frames_info_v0_3.S", endsWith: "owner" }
          value: {
            equalTo: "e9e8aad29ce8e94fd77d9c55582e5e0c57cf81c552ba61c0d4e34b0dc11fd931"
          }
        }
      ) {
        nodes {
          key
        }
      }
    }
  `;
};

