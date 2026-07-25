import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NameDialog } from '@/components/dialogs/NameDialog'

describe('NameDialog', () => {
  it('submits the entered name and closes', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onOpenChange = vi.fn()

    render(
      <NameDialog
        open
        onOpenChange={onOpenChange}
        title="New folder"
        description="Create a folder"
        placeholder="Contracts"
        submitLabel="Create"
        onSubmit={onSubmit}
      />,
    )

    const input = screen.getByLabelText('Name')
    await user.clear(input)
    await user.type(input, 'Legal')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Legal')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('disables submit when name is empty', () => {
    render(
      <NameDialog
        open
        onOpenChange={() => undefined}
        title="Rename"
        description="Rename item"
        initialName=""
        onSubmit={() => undefined}
      />,
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})
