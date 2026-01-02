export interface Tag {
  id: string
  label: string
  icon?: string
}

export const PRESET_TAGS: Tag[] = [
  { id: 'work', label: 'Work' },
  { id: 'meeting', label: 'Meeting' },
  { id: 'break', label: 'Break' },
  { id: 'scroll', label: 'Scroll' },
  { id: 'learn', label: 'Learn' },
  { id: 'other', label: 'Other' },
]

export function getTagById(id: string): Tag | undefined {
  return PRESET_TAGS.find((tag) => tag.id === id)
}
