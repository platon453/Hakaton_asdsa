// Логгер для AmoCRM операций

interface AmoCRMLog {
  timestamp: string
  action: string
  contactId?: number
  dealId?: number
  bookingId?: string
  details: any
}

class AmoCRMLogger {
  private logs: AmoCRMLog[] = []
  private maxLogs = 100

  log(action: string, details: any) {
    const logEntry: AmoCRMLog = {
      timestamp: new Date().toISOString(),
      action,
      contactId: details.contactId,
      dealId: details.dealId,
      bookingId: details.bookingId,
      details,
    }

    this.logs.unshift(logEntry)

    // Ограничиваем количество логов
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Логируем в консоль с эмодзи
    const emoji = this.getEmoji(action)
    console.log(`${emoji} AmoCRM [${action}]:`, details)
  }

  private getEmoji(action: string): string {
    const emojiMap: Record<string, string> = {
      'contact_created': '👤',
      'contact_updated': '👤',
      'deal_created': '💼',
      'deal_updated': '💼',
      'status_changed': '🔄',
      'error': '❌',
    }
    return emojiMap[action] || '📝'
  }

  getLogs(limit?: number): AmoCRMLog[] {
    return limit ? this.logs.slice(0, limit) : this.logs
  }

  getLastLog(): AmoCRMLog | undefined {
    return this.logs[0]
  }

  clear() {
    this.logs = []
  }
}

export const amocrmLogger = new AmoCRMLogger()
