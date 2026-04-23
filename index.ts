import * as si from 'systeminformation'

export type FeedbackSystemInfo = {
  cpu: {
    manufacturer: string
    brand: string
    usagePercent: number
  }
  gpu: Array<{
    vendor: string
    model: string
    vramMb: number | null
    usagePercent: number | null
  }>
  memory: {
    totalGb: number
    usedGb: number
    usagePercent: number
  }
}

const roundToTwoDecimals = (value: number) => Number(value.toFixed(2))
const bytesToGb = (value: number) => roundToTwoDecimals(value / 1024 / 1024 / 1024)

export const getFeedbackSystemInfo = async (): Promise<FeedbackSystemInfo> => {
  const [cpuInfo, currentLoad, graphics, memory] = await Promise.all([
    si.cpu(),
    si.currentLoad(),
    si.graphics(),
    si.mem()
  ])

  return {
    cpu: {
      manufacturer: cpuInfo.manufacturer,
      brand: cpuInfo.brand,
      usagePercent: roundToTwoDecimals(currentLoad.currentLoad)
    },
    gpu: graphics.controllers.map(gpu => ({
      vendor: gpu.vendor || '',
      model: gpu.model || '',
      // 显存大小
      vramMb: gpu.vram ?? null,
      usagePercent:
        typeof gpu.utilizationGpu === 'number' ? roundToTwoDecimals(gpu.utilizationGpu) : null
    })),
    memory: {
      totalGb: bytesToGb(memory.total),
      usedGb: bytesToGb(memory.used),
      usagePercent: roundToTwoDecimals((memory.used / memory.total) * 100)
    }
  }
}
