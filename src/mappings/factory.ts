import { BigInt} from '@graphprotocol/graph-ts'
import { PairCreated } from '../../generated/Factory/Factory'
import { Pair, Token } from '../../generated/schema'
import { Pair as PairTemplate } from '../../generated/templates'
import { ERC20 } from '../../generated/Factory/ERC20'

export function handlePairCreated(event: PairCreated): void {
  // 加载或创建两个token
  let token0 = Token.load(event.params.token0.toHexString())
  let token1 = Token.load(event.params.token1.toHexString())

  // 如果token不存在，创建它们
  if (token0 === null) {
    token0 = new Token(event.params.token0.toHexString())
    let erc20 = ERC20.bind(event.params.token0)

    // 使用try_方法安全调用
    let symbolResult = erc20.try_symbol()
    token0.symbol = symbolResult.reverted ? "UNKNOWN" : symbolResult.value

    let nameResult = erc20.try_name()
    token0.name = nameResult.reverted ? "Unknown Token" : nameResult.value

    let decimalsResult = erc20.try_decimals()
    token0.decimals = decimalsResult.reverted ? BigInt.fromI32(18) : BigInt.fromI32(decimalsResult.value)

    let totalSupplyResult = erc20.try_totalSupply()
    token0.totalSupply = totalSupplyResult.reverted ? BigInt.fromI32(0) : totalSupplyResult.value

    token0.tradeVolume = BigInt.fromI32(0).toBigDecimal()
    token0.tradeVolumeUSD = BigInt.fromI32(0).toBigDecimal()
    token0.untrackedVolumeUSD = BigInt.fromI32(0).toBigDecimal()
    token0.txCount = BigInt.fromI32(0)
    token0.totalLiquidity = BigInt.fromI32(0).toBigDecimal()
    token0.derivedETH = BigInt.fromI32(0).toBigDecimal()
    token0.save()
  }

  if (token1 === null) {
    token1 = new Token(event.params.token1.toHexString())
    let erc20 = ERC20.bind(event.params.token1)

    // 使用try_方法安全调用
    let symbolResult = erc20.try_symbol()
    token1.symbol = symbolResult.reverted ? "UNKNOWN" : symbolResult.value

    let nameResult = erc20.try_name()
    token1.name = nameResult.reverted ? "Unknown Token" : nameResult.value

    let decimalsResult = erc20.try_decimals()
    token1.decimals = decimalsResult.reverted ? BigInt.fromI32(18) : BigInt.fromI32(decimalsResult.value)

    let totalSupplyResult = erc20.try_totalSupply()
    token1.totalSupply = totalSupplyResult.reverted ? BigInt.fromI32(0) : totalSupplyResult.value

    token1.tradeVolume = BigInt.fromI32(0).toBigDecimal()
    token1.tradeVolumeUSD = BigInt.fromI32(0).toBigDecimal()
    token1.untrackedVolumeUSD = BigInt.fromI32(0).toBigDecimal()
    token1.txCount = BigInt.fromI32(0)
    token1.totalLiquidity = BigInt.fromI32(0).toBigDecimal()
    token1.derivedETH = BigInt.fromI32(0).toBigDecimal()
    token1.save()
  }

  // 创建Pair实体
  let pair = new Pair(event.params.pair.toHexString())
  pair.token0 = token0.id
  pair.token1 = token1.id
  pair.reserve0 = BigInt.fromI32(0).toBigDecimal()
  pair.reserve1 = BigInt.fromI32(0).toBigDecimal()
  pair.totalSupply = BigInt.fromI32(0).toBigDecimal()
  pair.reserveETH = BigInt.fromI32(0).toBigDecimal()
  pair.reserveUSD = BigInt.fromI32(0).toBigDecimal()
  pair.trackedReserveETH = BigInt.fromI32(0).toBigDecimal()
  pair.token0Price = BigInt.fromI32(0).toBigDecimal()
  pair.token1Price = BigInt.fromI32(0).toBigDecimal()
  pair.volumeToken0 = BigInt.fromI32(0).toBigDecimal()
  pair.volumeToken1 = BigInt.fromI32(0).toBigDecimal()
  pair.volumeUSD = BigInt.fromI32(0).toBigDecimal()
  pair.untrackedVolumeUSD = BigInt.fromI32(0).toBigDecimal()
  pair.txCount = BigInt.fromI32(0)
  pair.createdAtTimestamp = event.block.timestamp
  pair.createdAtBlockNumber = event.block.number
  pair.liquidityProviderCount = BigInt.fromI32(0)
  pair.save()

  // 创建模板 - 这是关键步骤，让subgraph开始监听这个新的Pair合约
  PairTemplate.create(event.params.pair)
}
