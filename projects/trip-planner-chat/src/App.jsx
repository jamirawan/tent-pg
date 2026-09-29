import { useEffect, useMemo, useState } from 'react'
import './App.css'

function mean(values) {
  if (!values.length) return 0
  const sum = values.reduce((acc, v) => acc + v, 0)
  return sum / values.length
}

function median(values) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function quantile(values, q) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  }
  return sorted[base]
}

function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A'
  return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(digits)
}

function formatDate(value) {
  if (!value) return 'Unknown'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return date.toLocaleString()
}

function formatDateInput(value) {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString()
}

function countWords(text) {
  if (!text || !text.trim()) return 0
  return text.trim().split(/\s+/).length
}

function countSentences(text) {
  if (!text || !text.trim()) return 0
  return text.trim().split(/[.!?]+/).filter((s) => s.trim().length > 0).length
}

function bucketWordCount(count) {
  if (count <= 5) return '0-5'
  if (count <= 10) return '6-10'
  if (count <= 20) return '11-20'
  if (count <= 50) return '21-50'
  return '51+'
}

function bucketCharCount(count) {
  if (count <= 20) return '0-20'
  if (count <= 50) return '21-50'
  if (count <= 100) return '51-100'
  if (count <= 200) return '101-200'
  return '201+'
}

function bucketSentenceCount(count) {
  if (count === 0) return '0'
  if (count === 1) return '1'
  if (count <= 3) return '2-3'
  if (count <= 6) return '4-6'
  return '7+'
}

function bucketResponseTime(elapsedSec) {
  if (elapsedSec < 1) return '<1s'
  const bucketStart = Math.floor(elapsedSec / 10) * 10
  const bucketEnd = bucketStart + 10
  return `${bucketStart} - ${bucketEnd}s`
}

function sortResponseTimeBuckets(entries) {
  return [...entries].sort(([a], [b]) => {
    if (a === '<1s') return -1
    if (b === '<1s') return 1
    return parseInt(a, 10) - parseInt(b, 10)
  })
}

const CHAR_BUCKET_ORDER = ['0-20', '21-50', '51-100', '101-200', '201+']
const WORD_BUCKET_ORDER = ['0-5', '6-10', '11-20', '21-50', '51+']
const SENTENCE_BUCKET_ORDER = ['0', '1', '2-3', '4-6', '7+']

function BucketChart({ title, entries }) {
  const max = Math.max(...entries.map(([, v]) => v), 1)
  return (
    <div className="bucket-group">
      <h4>{title}</h4>
      <div className="bar-chart">
        {entries.map(([label, value]) => (
          <div key={label} className="bar-col">
            <span className="bar-value">{value}</span>
            <div
              className="bar-fill"
              style={{ height: `${Math.round((value / max) * 100)}%` }}
            />
            <span className="bar-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'but', 'for', 'from', 'has', 'have', 'had',
  'he', 'her', 'hers', 'him', 'his', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'me', 'my',
  'no', 'not', 'of', 'on', 'or', 'our', 'ours', 'she', 'so', 'that', 'the', 'their', 'them',
  'then', 'there', 'they', 'this', 'to', 'us', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'who', 'why', 'with', 'you', 'your', 'yours', 'im', 'ive', 'dont', 'cant', 'wont',
  'trip', 'trips', 'day', 'days',
])

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractTokens(text) {
  const normalized = normalizeText(text)
  if (!normalized) return []
  return normalized
    .split(' ')
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token))
}

function buildPhraseCounts(messages, minWords = 2, maxWords = 3) {
  const counts = new Map()

  messages.forEach((message) => {
    if (message.role !== 'user') return
    const tokens = extractTokens(message.contentText || message.contentRaw || '')
    if (!tokens.length) return

    for (let size = minWords; size <= maxWords; size += 1) {
      if (tokens.length < size) continue
      for (let i = 0; i <= tokens.length - size; i += 1) {
        const phrase = tokens.slice(i, i + size).join(' ')
        if (!phrase) continue
        counts.set(phrase, (counts.get(phrase) || 0) + 1)
      }
    }
  })

  return counts
}

function parseLeadingJson(text) {
  const first = text[0]
  if (first !== '{' && first !== '[') {
    return { json: null, endIndex: 0, error: 'not-json' }
  }

  let depth = 0
  let inString = false
  let escape = false
  let endIndex = -1

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]

    if (inString) {
      if (escape) {
        escape = false
      } else if (ch === '\\') {
        escape = true
      } else if (ch === '"') {
        inString = false
      }
      continue
    }

    if (ch === '"') {
      inString = true
      continue
    }

    if (ch === '{' || ch === '[') {
      depth += 1
    } else if (ch === '}' || ch === ']') {
      depth -= 1
      if (depth === 0) {
        endIndex = i + 1
        break
      }
    }
  }

  if (endIndex === -1) {
    return { json: null, endIndex: 0, error: 'unterminated' }
  }

  const slice = text.slice(0, endIndex)
  try {
    return { json: JSON.parse(slice), endIndex, error: null }
  } catch {
    return { json: null, endIndex: 0, error: 'parse-error' }
  }
}

function parseContent(raw) {
  if (raw === null || raw === undefined) {
    return { contentText: '', contentJson: null, trailingText: '' }
  }

  const rawString = String(raw)
  const trimmed = rawString.trim()

  if (!trimmed) {
    return { contentText: '', contentJson: null, trailingText: '' }
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const { json, endIndex } = parseLeadingJson(trimmed)
    if (json) {
      const trailingText = trimmed.slice(endIndex).trim()
      const messageResponse = json && typeof json === 'object' && !Array.isArray(json)
        ? json.MessageResponse || ''
        : ''
      const contentText = messageResponse || trailingText || trimmed
      return { contentText, contentJson: json, trailingText }
    }
  }

  return { contentText: rawString, contentJson: null, trailingText: '' }
}

function buildTurns(messages) {
  const turns = []
  let pendingUser = null

  messages.forEach((message) => {
    if (message.role === 'user') {
      if (pendingUser) {
        turns.push({ user: pendingUser, assistant: null })
      }
      pendingUser = message
      return
    }

    if (message.role === 'assistant') {
      if (pendingUser) {
        turns.push({ user: pendingUser, assistant: message })
        pendingUser = null
      } else {
        turns.push({ user: null, assistant: message })
      }
    }
  })

  if (pendingUser) {
    turns.push({ user: pendingUser, assistant: null })
  }

  return turns
}

function buildDataset(rawMessages) {
  const threadsMap = new Map()

  rawMessages.forEach((message) => {
    const threadId = String(message.thread_id || 'unknown')
    if (!threadsMap.has(threadId)) {
      threadsMap.set(threadId, [])
    }
    threadsMap.get(threadId).push(message)
  })

  const threads = []

  threadsMap.forEach((messages, threadId) => {
    const sorted = [...messages].sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime()
      const bTime = new Date(b.timestamp).getTime()
      if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0
      return aTime - bTime
    })

    sorted.forEach((message, index) => {
      message.turnIndex = index + 1
    })

    const userMessages = sorted.filter((message) => message.role === 'user')
    const assistantMessages = sorted.filter((message) => message.role === 'assistant')

    const firstMessage = sorted[0]
    const lastMessage = sorted[sorted.length - 1]
    const firstUser = userMessages[0]
    const lastAssistant = assistantMessages[assistantMessages.length - 1]

    let tripTitle = null
    let tripDays = null
    for (let i = assistantMessages.length - 1; i >= 0; i -= 1) {
      const trip = assistantMessages[i].contentJson?.trip
      if (trip) {
        tripTitle = trip.title || null
        tripDays = Array.isArray(trip.days) ? trip.days.length : null
        break
      }
    }

    const searchableText = sorted
      .map((message) => message.contentText || message.contentRaw || '')
      .join(' ')
    const searchableTextNormalized = normalizeText(searchableText)

    threads.push({
      threadId,
      messages: sorted,
      messageCount: sorted.length,
      userCount: userMessages.length,
      assistantCount: assistantMessages.length,
      startedAt: firstMessage?.timestamp || null,
      lastAt: lastMessage?.timestamp || null,
      firstUserText: firstUser?.contentText || firstUser?.contentRaw || '',
      lastAssistantText: lastAssistant?.contentText || lastAssistant?.contentRaw || '',
      tripTitle,
      tripDays,
      searchableText,
      searchableTextNormalized,
    })
  })

  threads.sort((a, b) => {
    const aTime = new Date(a.lastAt).getTime()
    const bTime = new Date(b.lastAt).getTime()
    return bTime - aTime
  })

  const messageCounts = threads.map((thread) => thread.messageCount)
  const userCounts = threads.map((thread) => thread.userCount)
  const assistantCounts = threads.map((thread) => thread.assistantCount)

  const stats = {
    totalThreads: threads.length,
    totalMessages: messageCounts.reduce((acc, v) => acc + v, 0),
    avgUserPrompts: mean(userCounts),
    medianUserPrompts: median(userCounts),
    p75UserPrompts: quantile(userCounts, 0.75),
    avgMessages: mean(messageCounts),
    avgAssistant: mean(assistantCounts),
  }

  const userPromptDistribution = userCounts.reduce((acc, count) => {
    acc[count] = (acc[count] || 0) + 1
    return acc
  }, {})

  const phraseCounts = buildPhraseCounts(rawMessages)
  const topPhrases = [...phraseCounts.entries()]
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
    .slice(0, 24)
    .map(([phrase, count]) => ({ phrase, count }))

  return { threads, stats, userPromptDistribution, topPhrases }
}

function App() {
  const [state, setState] = useState({
    status: 'loading',
    error: null,
    dataset: null,
  })
  const [selectedThreadId, setSelectedThreadId] = useState(null)
  const [query, setQuery] = useState('')
  const [onlyTrips, setOnlyTrips] = useState(false)
  const [viewMode, setViewMode] = useState('messages')
  const [showTripJson, setShowTripJson] = useState(false)
  const [sortOrder, setSortOrder] = useState('desc')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [phraseFilter, setPhraseFilter] = useState('')
  const [promptCountFilter, setPromptCountFilter] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}chats.json`)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} loading chats.json`)
        }
        const rawText = await response.text()
        const cleanedText = rawText.replace(/^\uFEFF/, '')
        const lines = cleanedText.split(/\r?\n/).filter((line) => line.trim().length)

        const rawMessages = lines.map((line) => {
          const parsed = JSON.parse(line)
          const role = String(parsed.role || '').toLowerCase()
          const { contentText, contentJson, trailingText } = parseContent(parsed.content)
          return {
            ...parsed,
            role,
            contentRaw: parsed.content ?? '',
            contentText,
            contentJson,
            trailingText,
          }
        })

        const dataset = buildDataset(rawMessages)

        if (isMounted) {
          setState({ status: 'ready', error: null, dataset })
          setSelectedThreadId(dataset.threads[0]?.threadId || null)
        }
      } catch (error) {
        if (isMounted) {
          setState({ status: 'error', error: error.message, dataset: null })
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredThreads = useMemo(() => {
    if (!state.dataset) return []
    const normalizedQuery = normalizeText(query)

    const filtered = state.dataset.threads.filter((thread) => {
      const lastAt = new Date(thread.lastAt)
      if (dateFrom) {
        const start = new Date(`${dateFrom}T00:00:00`)
        if (Number.isNaN(lastAt.getTime()) || lastAt < start) return false
      }
      if (dateTo) {
        const end = new Date(`${dateTo}T23:59:59.999`)
        if (Number.isNaN(lastAt.getTime()) || lastAt > end) return false
      }
      if (onlyTrips && !thread.tripTitle) return false
      if (phraseFilter && !thread.searchableTextNormalized.includes(phraseFilter)) return false
      if (promptCountFilter !== null && thread.userCount !== promptCountFilter) return false
      if (!normalizedQuery) return true
      return thread.searchableTextNormalized.includes(normalizedQuery)
    })

    return [...filtered].sort((a, b) => {
      const aTime = new Date(a.lastAt).getTime()
      const bTime = new Date(b.lastAt).getTime()
      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0
      if (Number.isNaN(aTime)) return 1
      if (Number.isNaN(bTime)) return -1
      return sortOrder === 'asc' ? aTime - bTime : bTime - aTime
    })
  }, [state.dataset, query, onlyTrips, sortOrder, dateFrom, dateTo, phraseFilter, promptCountFilter])

  const activeThreadId = useMemo(() => {
    if (!filteredThreads.length) return null
    const stillExists = filteredThreads.some((thread) => thread.threadId === selectedThreadId)
    return stillExists ? selectedThreadId : filteredThreads[0].threadId
  }, [filteredThreads, selectedThreadId])

  const selectedThread = useMemo(() => {
    if (!state.dataset || !activeThreadId) return null
    return state.dataset.threads.find((thread) => thread.threadId === activeThreadId) || null
  }, [state.dataset, activeThreadId])

  const filteredPromptDistribution = useMemo(() => {
    if (!filteredThreads.length) return {}
    return filteredThreads.reduce((acc, thread) => {
      const count = thread.userCount
      acc[count] = (acc[count] || 0) + 1
      return acc
    }, {})
  }, [filteredThreads])

  const filteredPromptsAnalysis = useMemo(() => {
    const userTexts = filteredThreads.flatMap((thread) =>
      thread.messages
        .filter((m) => m.role === 'user')
        .map((m) => m.contentText || m.contentRaw || ''),
    )
    if (!userTexts.length) return null

    const charCounts = userTexts.map((t) => t.length)
    const wordCounts = userTexts.map((t) => countWords(t))
    const sentenceCounts = userTexts.map((t) => countSentences(t))

    const charBuckets = charCounts.reduce((acc, c) => {
      const bucket = bucketCharCount(c)
      acc[bucket] = (acc[bucket] || 0) + 1
      return acc
    }, {})

    const wordBuckets = wordCounts.reduce((acc, c) => {
      const bucket = bucketWordCount(c)
      acc[bucket] = (acc[bucket] || 0) + 1
      return acc
    }, {})

    const sentenceBuckets = sentenceCounts.reduce((acc, c) => {
      const bucket = bucketSentenceCount(c)
      acc[bucket] = (acc[bucket] || 0) + 1
      return acc
    }, {})

    return {
      avgChars: mean(charCounts),
      avgWords: mean(wordCounts),
      avgSentences: mean(sentenceCounts),
      charBuckets,
      wordBuckets,
      sentenceBuckets,
    }
  }, [filteredThreads])

  const filteredPerformanceAnalysis = useMemo(() => {
    const responseTimes = []

    filteredThreads.forEach((thread) => {
      let lastUserTime = null
      thread.messages.forEach((message) => {
        if (message.role === 'user') {
          const t = new Date(message.timestamp).getTime()
          if (!Number.isNaN(t)) lastUserTime = t
        } else if (message.role === 'assistant' && lastUserTime !== null) {
          const t = new Date(message.timestamp).getTime()
          if (!Number.isNaN(t)) {
            const elapsedSec = (t - lastUserTime) / 1000
            if (elapsedSec >= 0) responseTimes.push(elapsedSec)
          }
          lastUserTime = null
        }
      })
    })

    if (!responseTimes.length) return null

    const buckets = responseTimes.reduce((acc, sec) => {
      const bucket = bucketResponseTime(sec)
      acc[bucket] = (acc[bucket] || 0) + 1
      return acc
    }, { '<1s': 0 })

    return {
      avgResponseTime: mean(responseTimes),
      totalMeasured: responseTimes.length,
      buckets,
    }
  }, [filteredThreads])

  if (state.status === 'loading') {
    return (
      <div className="app">
        <div className="loading">Loading chat history...</div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="app">
        <div className="error">Failed to load chats.json: {state.error}</div>
      </div>
    )
  }

  const { stats, topPhrases } = state.dataset
  const turns = selectedThread ? buildTurns(selectedThread.messages) : []
  const activeFilters = [
    query.trim()
      ? {
          id: 'search',
          label: `Search: ${query.trim()}`,
          onClear: () => setQuery(''),
        }
      : null,
    phraseFilter
      ? {
          id: 'phrase',
          label: `Phrase: ${phraseFilter}`,
          onClear: () => setPhraseFilter(''),
        }
      : null,
    dateFrom
      ? {
          id: 'from',
          label: `From: ${formatDateInput(dateFrom)}`,
          onClear: () => setDateFrom(''),
        }
      : null,
    dateTo
      ? {
          id: 'to',
          label: `To: ${formatDateInput(dateTo)}`,
          onClear: () => setDateTo(''),
        }
      : null,
    promptCountFilter !== null
      ? {
          id: 'prompt-count',
          label: `${promptCountFilter} user prompts`,
          onClear: () => setPromptCountFilter(null),
        }
      : null,
    onlyTrips
      ? {
          id: 'trips',
          label: 'Trips only',
          onClear: () => setOnlyTrips(false),
        }
      : null,
  ].filter(Boolean)

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">Tourism NT</p>
          <h1>Military Trip Planner Conversation Insights</h1>
          <p className="subhead">
            Explore user prompts, assistant responses, and itinerary payloads across every thread.
          </p>
        </div>
        <div className="tag">Data source: chats.json</div>
      </header>

      <section className="stats">
        <div className="stat-card">
          <p>Total threads</p>
          <h2>{formatNumber(stats.totalThreads)}</h2>
        </div>
        <div className="stat-card">
          <p>Total messages</p>
          <h2>{formatNumber(stats.totalMessages)}</h2>
        </div>
        <div className="stat-card">
          <p>Avg user prompts</p>
          <h2>{formatNumber(stats.avgUserPrompts)}</h2>
          <span>Median {formatNumber(stats.medianUserPrompts)}</span>
        </div>
        <div className="stat-card">
          <p>Avg messages per thread</p>
          <h2>{formatNumber(stats.avgMessages)}</h2>
          <span>75th pct {formatNumber(stats.p75UserPrompts)}</span>
        </div>
      </section>

      <section className="controls">
        <input
          className="search"
          type="search"
          placeholder="Search prompts, responses, or itinerary text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="date-filter">
          <label>
            From
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </label>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={onlyTrips}
            onChange={(event) => setOnlyTrips(event.target.checked)}
          />
          Only threads with trip data
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showTripJson}
            onChange={(event) => setShowTripJson(event.target.checked)}
          />
          Show trip JSON in messages
        </label>
        <div className="sort-toggle">
          <span>Sort by date</span>
          <div className="sort-buttons">
            <button
              type="button"
              className={sortOrder === 'desc' ? 'active' : ''}
              onClick={() => setSortOrder('desc')}
            >
              Newest
            </button>
            <button
              type="button"
              className={sortOrder === 'asc' ? 'active' : ''}
              onClick={() => setSortOrder('asc')}
            >
              Oldest
            </button>
          </div>
        </div>
        <div className="view-toggle">
          <button
            type="button"
            className={viewMode === 'messages' ? 'active' : ''}
            onClick={() => setViewMode('messages')}
          >
            Messages
          </button>
          <button
            type="button"
            className={viewMode === 'turns' ? 'active' : ''}
            onClick={() => setViewMode('turns')}
          >
            Turns
          </button>
        </div>
      </section>

      {activeFilters.length ? (
        <section className="filter-bar">
          <span className="filter-title">Active filters</span>
          <div className="filter-chips">
            {activeFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className="filter-chip"
                onClick={filter.onClear}
                aria-label={`Remove filter ${filter.label}`}
              >
                <span>{filter.label}</span>
                <span className="chip-remove">x</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="phrases">
        <div className="phrases-header">
          <div>
            <h3>Top phrases (user prompts)</h3>
            <p>2–3 word phrases after removing common stop words.</p>
          </div>
          {phraseFilter ? (
            <button
              type="button"
              className="phrase-clear"
              onClick={() => setPhraseFilter('')}
            >
              Clear filter: {phraseFilter}
            </button>
          ) : null}
        </div>
        <div className="phrase-grid">
          {topPhrases.map((item) => (
            <button
              key={item.phrase}
              type="button"
              className={`phrase-card ${phraseFilter === item.phrase ? 'selected' : ''}`}
              onClick={() => setPhraseFilter((prev) => (prev === item.phrase ? '' : item.phrase))}
            >
              <span className="phrase-text">{item.phrase}</span>
              <span className="phrase-count">{item.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="phrases">
        <div className="phrases-header">
          <div>
            <h3>User prompt distribution</h3>
            <p>Counts reflect the currently filtered threads.</p>
          </div>
          <span className="distribution-count">
            {Object.keys(filteredPromptDistribution).length} buckets
          </span>
        </div>
        <div className="phrase-grid">
          {Object.entries(filteredPromptDistribution)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([count, total]) => {
              const countNumber = Number(count)
              const isSelected = promptCountFilter === countNumber
              return (
                <button
                  key={count}
                  type="button"
                  className={`phrase-card ${isSelected ? 'selected' : ''}`}
                  onClick={() =>
                    setPromptCountFilter((prev) => (prev === countNumber ? null : countNumber))
                  }
                >
                  <span className="phrase-text">{count} prompts</span>
                  <span className="phrase-count">{total} threads</span>
                </button>
              )
            })}
        </div>
      </section>

      {filteredPromptsAnalysis && (
        <section className="phrases">
          <div className="phrases-header">
            <div>
              <h3>Prompts analysis</h3>
              <p>Statistics derived from user prompt content across filtered threads.</p>
            </div>
          </div>
          <div className="prompt-analysis-stats">
            <div className="stat-card">
              <p>Avg chars per prompt</p>
              <h2>{formatNumber(filteredPromptsAnalysis.avgChars)}</h2>
            </div>
            <div className="stat-card">
              <p>Avg words per prompt</p>
              <h2>{formatNumber(filteredPromptsAnalysis.avgWords)}</h2>
            </div>
            <div className="stat-card">
              <p>Avg sentences per prompt</p>
              <h2>{formatNumber(filteredPromptsAnalysis.avgSentences)}</h2>
            </div>
          </div>
          <div className="analysis-buckets">
            <BucketChart
              title="Character count"
              entries={CHAR_BUCKET_ORDER.map((b) => [`${b} chars`, filteredPromptsAnalysis.charBuckets[b] || 0])}
            />
            <BucketChart
              title="Word count"
              entries={WORD_BUCKET_ORDER.map((b) => [`${b} words`, filteredPromptsAnalysis.wordBuckets[b] || 0])}
            />
            <BucketChart
              title="Sentence count"
              entries={SENTENCE_BUCKET_ORDER.map((b) => [
                b === '1' ? '1 sentence' : `${b} sentences`,
                filteredPromptsAnalysis.sentenceBuckets[b] || 0,
              ])}
            />
          </div>
        </section>
      )}

      {filteredPerformanceAnalysis && (
        <section className="phrases">
          <div className="phrases-header">
            <div>
              <h3>Performance</h3>
              <p>Response times measured from user message to next assistant reply.</p>
            </div>
            <span className="distribution-count">
              {filteredPerformanceAnalysis.totalMeasured} pairs measured
            </span>
          </div>
          <div className="prompt-analysis-stats">
            <div className="stat-card">
              <p>Avg response time</p>
              <h2>{formatNumber(filteredPerformanceAnalysis.avgResponseTime)}s</h2>
            </div>
          </div>
          <div className="analysis-buckets">
            <BucketChart
              title="Response time distribution"
              entries={sortResponseTimeBuckets(Object.entries(filteredPerformanceAnalysis.buckets))}
            />
          </div>
        </section>
      )}

      <section className="main">
        <aside className="thread-list">
          <div className="thread-header">
            <h3>Threads</h3>
            <span>{filteredThreads.length} results</span>
          </div>
          <div className="thread-cards">
            {filteredThreads.map((thread) => (
              <button
                key={thread.threadId}
                type="button"
                className={`thread-card ${thread.threadId === activeThreadId ? 'selected' : ''}`}
                onClick={() => setSelectedThreadId(thread.threadId)}
              >
                <div className="thread-meta">
                  <span className="thread-id">{thread.threadId}</span>
                  <span className="thread-date">{formatDate(thread.lastAt)}</span>
                </div>
                <p className="thread-preview">{thread.firstUserText || 'No user prompt'}</p>
                <div className="thread-footer">
                  <span>{thread.userCount} user</span>
                  <span>{thread.assistantCount} assistant</span>
                  <span>{thread.messageCount} total</span>
                </div>
                {thread.tripTitle && (
                  <div className="thread-trip">
                    <span>Trip:</span>
                    <strong>{thread.tripTitle}</strong>
                  </div>
                )}
              </button>
            ))}
          </div>
        </aside>

        <section className="thread-detail">
          {selectedThread ? (
            <>
              <div className="detail-header">
                <div>
                  <h3>Thread {selectedThread.threadId}</h3>
                  <p>
                    {selectedThread.userCount} user prompts, {selectedThread.assistantCount} assistant replies
                  </p>
                </div>
                <div className="detail-meta">
                  <span>Start: {formatDate(selectedThread.startedAt)}</span>
                  <span>Last: {formatDate(selectedThread.lastAt)}</span>
                </div>
              </div>

              <div className="summary-grid">
                <div>
                  <span className="label">First user prompt</span>
                  <p>{selectedThread.firstUserText || 'No user prompt captured.'}</p>
                </div>
                <div>
                  <span className="label">Last assistant response</span>
                  <p>{selectedThread.lastAssistantText || 'No assistant response captured.'}</p>
                </div>
                <div>
                  <span className="label">Trip payload</span>
                  <p>
                    {selectedThread.tripTitle
                      ? `${selectedThread.tripTitle} (${selectedThread.tripDays || 'N/A'} days)`
                      : 'No trip object in responses.'}
                  </p>
                </div>
              </div>

              {viewMode === 'messages' ? (
                <div className="message-list">
                  {selectedThread.messages.map((message) => (
                    <div key={message.message_id} className={`message ${message.role}`}>
                      <div className="message-meta">
                        <span className="role">{message.role}</span>
                        <span>{formatDate(message.timestamp)}</span>
                      </div>
                      <p className="message-text">{message.contentText || 'Empty message.'}</p>
                      {message.trailingText && (
                        <p className="message-tail">Trailing text: {message.trailingText}</p>
                      )}
                      {showTripJson && message.contentJson?.trip && (
                        <pre className="json-block">{JSON.stringify(message.contentJson.trip, null, 2)}</pre>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="turn-list">
                  {turns.map((turn, index) => (
                    <div key={`${selectedThread.threadId}-turn-${index}`} className="turn">
                      <div className="turn-column">
                        <span className="label">User</span>
                        <p>{turn.user?.contentText || 'No user message'}</p>
                        {turn.user && <span className="meta">{formatDate(turn.user.timestamp)}</span>}
                      </div>
                      <div className="turn-column">
                        <span className="label">Assistant</span>
                        <p>{turn.assistant?.contentText || 'No assistant message'}</p>
                        {turn.assistant && <span className="meta">{formatDate(turn.assistant.timestamp)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty">Select a thread to view details.</div>
          )}
        </section>
      </section>
    </div>
  )
}

export default App
