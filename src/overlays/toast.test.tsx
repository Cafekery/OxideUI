import { toast as sonner } from 'sonner'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from './toast'

vi.mock('sonner', () => ({
  Toaster: () => null,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn(),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('toast', () => {
  it('maps each flavour onto the matching sonner call', () => {
    toast.success('started')
    toast.error('failed')
    toast.info('queued')
    toast.notice('almost full')
    toast.loading('working')

    expect(sonner.success).toHaveBeenCalledWith('started', undefined)
    expect(sonner.error).toHaveBeenCalledWith('failed', undefined)
    expect(sonner.info).toHaveBeenCalledWith('queued', undefined)
    expect(sonner.warning).toHaveBeenCalledWith('almost full', undefined)
    expect(sonner.loading).toHaveBeenCalledWith('working', undefined)
  })

  it('forwards options and dismissal ids', () => {
    toast.success('done', { description: 'All replicas healthy.', duration: 8000 })
    toast.dismiss('abc')

    expect(sonner.success).toHaveBeenCalledWith('done', {
      description: 'All replicas healthy.',
      duration: 8000,
    })
    expect(sonner.dismiss).toHaveBeenCalledWith('abc')
  })

  it('hands promises to sonner with the three lifecycle messages', () => {
    const pending = Promise.resolve(1)

    toast.promise(pending, { loading: 'saving', success: 'saved', error: 'nope' })

    expect(sonner.promise).toHaveBeenCalledWith(pending, {
      loading: 'saving',
      success: 'saved',
      error: 'nope',
    })
  })
})
