import { useState } from 'react'
import type { Meta, StoryObj } from '../../workbench/csf'
import { Pagination } from './pagination'

const meta = {
  component: Pagination,
  args: { page: 1, pageCount: 12, onPageChange: () => {} },
  argTypes: {
    page: { control: 'number' },
    pageCount: { control: 'number' },
  },
} satisfies Meta<typeof Pagination>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FirstPage: Story = {
  name: 'First page (previous disabled)',
  args: { page: 1, pageCount: 12 },
}

export const MiddlePage: Story = {
  name: 'Middle page (both ellipses)',
  args: { page: 6, pageCount: 12 },
}

export const LastPage: Story = {
  name: 'Last page (next disabled)',
  args: { page: 12, pageCount: 12 },
}

export const FewPages: Story = {
  name: 'Few pages (no ellipses)',
  args: { page: 2, pageCount: 4 },
}

export const SinglePage: Story = {
  args: { page: 1, pageCount: 1 },
}

export const WithPageSize: Story = {
  name: 'With page size select',
  render: () => {
    const [page, setPage] = useState(3)
    const [pageSize, setPageSize] = useState(25)

    return (
      <Pagination
        page={page}
        pageCount={40}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(next) => {
          setPageSize(next)
          setPage(1)
        }}
      />
    )
  },
}

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1)

    return (
      <div className="flex flex-col gap-3">
        <Pagination page={page} pageCount={20} onPageChange={setPage} />
        <p className="text-mono-sm text-tertiary">Page {page} of 20</p>
      </div>
    )
  },
}
