# the-graph-demo

### `npm install` / `yarn install`

Install the libraries.

### `npm run dev` / `yarn dev`

Run the Code to get the results

Tasks:

1.  Retrieve Data on Ethereum mainnet

I created a subgraph by using Linear Finance's Contract(0x3e9bc21c9b189c09df3ef1b824798658d5011937) by finding its contract address on etherscan.

2.  Daily active users in Linear Buildr + Daily active users in Linear Exchange

First, I go to these two pages:

Linear Buildr: https://buildr.linear.finance/

Linear Exchange: https://exchange.linear.finance/

And I found that the data sources by reading the network tab:

Linear Buildr - https://buildr.linear.finance/subgraphs/name/linear-finance/buildr-bsc

Linear Exchange - https://exchange.linear.finance/graph/subgraphs/name/linear-finance/exchange-bsc

I used these two links by trying out their GraphQL playground, then I assume:

1: Daily active users on Linear Buildr = Number of event `Transfer` is triggered in the current Date

2: Daily active users on Linear Exchange = (Cannot figure how it can be determined by using the GraphQL playground on exchange-bsc)

Until you said that I should build up my own subgraph to retrieve the data, instead of the public data source. Therefore I go to Linear Finance's github page to see is there any contract address on mainnet (https://github.com/Linear-finance/linear/blob/master/log/mainnet-deployed.json) can be used to create a subgraph.

After trying out these address, I can only find that the contract I used in the beginning: LnProxyERC20 - 0x3E9BC21C9b189C09dF3eF1B824798658d5011937 is active currently among the contracts by Linear Finance.

This is the most confused part that I was not able to find determine what is the definition of these two terms. So I listed out two of them in my program:

1: Number of event `Transfer` is triggered in the current date

2: Number of function `transferFrom` is called in the current date

You told me that the active users should use the second definition, but I found that two of them return different results, so I logged them both out in my program.

3.  24 hours trading volume of each asset

At the beginning, I used the public data source by Linear Exchange (exchange-bsc) to find the trading volumes of each assets displayed on Linear Exchange platform.

Now, I tried to build the data by myself on my own subgraph. Then I found the contract address of cryptocurrencies (BNB, LINK) on etherscan and added both of them into my subgraph. I assume trading volume of one asset is determined by adding up the `value` field in the `Transfer` event object in the past 24 hours.

I filtered only current timestamp subtracting 24 hours data by using filter by querying my subgraph:

1: timestamp before 24 hours = Math.round(new Date().getTime() / 1000) - (60 * 60 * 24);

2: WHERE timestamp_gte: timestamp before 24 hours

I am not sure about which asset of trading volume you want me to retrieve, so I choose two of them (BNB, LINK) to display their 24 hours trading volume.