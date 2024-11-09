/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation
 The sidebars can be generated from the filesystem, or explicitly defined here.
 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebar = {
  bundlerSidebar: [
    "index",
    {
      type: "category",
      label: "Interacting with Transeptor",
      link: { type: "generated-index" },
      collapsed: false,
      items: [{ type: "autogenerated", dirName: "interacting-with-transeptor" }],
    },
    {
      type: "category",
      label: "Monitoring",
      link: { type: "generated-index" },
      items: [{ type: "autogenerated", dirName: "monitoring" }],
    },
  ],
};
  
module.exports = sidebar;