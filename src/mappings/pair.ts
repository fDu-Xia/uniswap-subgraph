import { BigInt } from '@graphprotocol/graph-ts'
import {
  Pair,
  Token,
  Swap as SwapEvent,
} from '../../generated/schema'
import {
  Swap,
  Sync,
} from '../../generated/templates/Pair/Pair'

export function handleSwap(event: Swap): void {
  let pair = Pair.load(event.address.toHexString())!
  let token0 = Token.load(pair.token0)
  let token1 = Token.load(pair.token1)
  
  // 更新Pair的交易量统计
  pair.volumeToken0 = pair.volumeToken0.plus(event.params.amount0In.toBigDecimal().minus(event.params.amount0Out.toBigDecimal()))
  pair.volumeToken1 = pair.volumeToken1.plus(event.params.amount1In.toBigDecimal().minus(event.params.amount1Out.toBigDecimal()))
  pair.txCount = pair.txCount.plus(BigInt.fromI32(1))
  pair.save()

  // 创建Swap事件记录
  let swap = new SwapEvent(
    event.transaction.hash.toHexString() + '-' + event.logIndex.toString()
  )
  swap.timestamp = event.block.timestamp
  swap.pair = pair.id
  swap.sender = event.params.sender
  swap.amount0In = event.params.amount0In.toBigDecimal()
  swap.amount1In = event.params.amount1In.toBigDecimal()
  swap.amount0Out = event.params.amount0Out.toBigDecimal()
  swap.amount1Out = event.params.amount1Out.toBigDecimal()
  swap.to = event.params.to
  swap.logIndex = event.logIndex
  // 这里可以添加更多的计算，如USD价格等
  swap.amountUSD = BigInt.fromI32(0).toBigDecimal() // 简化，实际上需要根据价格计算
  swap.save()
}

export function handleSync(event: Sync): void {
  let pair = Pair.load(event.address.toHexString())!
  
  pair.reserve0 = event.params.reserve0.toBigDecimal()
  pair.reserve1 = event.params.reserve1.toBigDecimal()
  
  if (pair.reserve1.notEqual(BigInt.fromI32(0).toBigDecimal())) {
    pair.token0Price = pair.reserve0.div(pair.reserve1)
  } else {
    pair.token0Price = BigInt.fromI32(0).toBigDecimal()
  }
  
  if (pair.reserve0.notEqual(BigInt.fromI32(0).toBigDecimal())) {
    pair.token1Price = pair.reserve1.div(pair.reserve0)
  } else {
    pair.token1Price = BigInt.fromI32(0).toBigDecimal()
  }
  
  pair.save()
}


