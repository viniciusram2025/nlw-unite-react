import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Table } from './table/table';
import { TableRow } from './table/table-row';
import { TableCell } from './table/table-cell';
import { TableHeader } from './table/table-header';
import { IconButton } from './icon-button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
//import { attendees } from './data/attendees';
//import { formatRelative } from 'date-fns';
//import { ptBR } from 'date-fns/locale';

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
	id: string
	name: string
	email: string
	createdAt: string
	checkedInAt: string | null
}

export function AttendeeList() {
	const [searchInput, setSearchInput] = useState(() => {
		const url = new URL(window.location.toString())

		if (url.searchParams.has('search')) {
			return url.searchParams.get('search') ?? ''
		}

		return ''
	});
	const [page, setPage] = useState(() => {
		const url = new URL(window.location.toString())
		if (url.searchParams.has('page')) {
			return Number(url.searchParams.get('page'))
		}

		return 1
	});

	//const page = 1

	const [total, setTotal] = useState(0);
	const [attendees, setAttendees] = useState<Attendee[]>([]);

	const totalPages = Math.ceil(total / 10)

	useEffect(() => {
		const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')
		url.searchParams.set('pageIndex', String(page - 1))

		if (searchInput.length > 0) {
			url.searchParams.set('query', searchInput)
		}

		fetch(url)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				setAttendees(data.attendees)
				setTotal(data.total)
			})
	}, [page, searchInput])

	function setCurrentSearch(search: string) {
		const url = new URL(window.location.toString())
		url.searchParams.set('search', search)
		window.history.pushState({}, '', url)
		setSearchInput(search)
	}

	function onSearchInputHandler(e: ChangeEvent<HTMLInputElement>) {
		setCurrentSearch(e.target.value)
		setCurrentPage(1)
	}

	function goToFirstPage() {
		setCurrentPage(1)
	}

	function goToNextPage() {
		setCurrentPage(page + 1)
	}

	function setCurrentPage(page: number) {
		const url = new URL(window.location.toString())
		url.searchParams.set('page', String(page))
		window.history.pushState({}, '', url)
		setPage(page)
	}

	function goToPreviousPage() {
		setCurrentPage(page - 1)
	}
	function goToLastPage() {
		setCurrentPage(totalPages)
	}



	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-3 items-center ">
				<h1 className="text-2xl font-bold">Participanes</h1>
				<div className="px-3 py-1.5 border w-72 border-white/10 rounded-lg text-sm flex items-center gap-3">
					<Search className='size-4 text-emerald-300' />
					<input
						onChange={onSearchInputHandler}
						value={searchInput}
						className="bg-transparent flex-1 outline-none h-auto border-0 p-0 text-sm ring-0 focus:ring-0"
						placeholder="Buscar participantes"
					/>
				</div>
			</div>

			<Table>
				<thead>
					<tr className='border-b border-white/10'>
						<TableHeader style={{ width: 48 }} className='py-3 px-4 text-sm font-semibold text-left'>
							<input type='checkbox' className='size-4 bg-black/20 rounded border border-white/10 checked:bg-orange-400' />
						</TableHeader>
						<TableHeader >Código</TableHeader>
						<TableHeader >Participantes</TableHeader>
						<TableHeader >Data de inscrição</TableHeader>
						<TableHeader >Data de check-in</TableHeader>
						<TableHeader style={{ width: 64 }} ></TableHeader>
					</tr>
				</thead>
				<tbody>
					{/* {attendees.slice((page - 1) * 10, page * 10).map((attendee) => {
						return (
							<TableRow key={attendee.id} >
								<TableCell>
									<input type='checkbox' className='size-4 bg-black/20 rounded border border-white/10 checked:bg-orange-400' />
								</TableCell>
								<TableCell>{attendee.id}</TableCell>
								<TableCell>
									<div className='flex flex-col gap-1 '>
										<span className='font-semibold text-white'>{attendee.name}</span>
										<span>{attendee.email}</span>
									</div>
								</TableCell>

								//mantido para informação de estudo - date-fns
								<TableCell>{formatRelative(attendee.createdAt, new Date(), { locale: ptBR })}</TableCell>
								<TableCell>{formatRelative(attendee.checkedInAt, new Date(), { locale: ptBR })}</TableCell> 

								//mantido para informação de estudo - dayjs
								<TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
								<TableCell>{dayjs().to(attendee.checkedInAt)}</TableCell>
								<TableCell>
									<IconButton transparent>
										<MoreHorizontal className='size-4' />
									</IconButton>
								</TableCell>
							</TableRow>
						)
					})} */}
					{attendees.map((attendee) => {
						return (
							<TableRow key={attendee.id} >
								<TableCell>
									<input type='checkbox' className='size-4 bg-black/20 rounded border border-white/10 checked:bg-orange-400' />
								</TableCell>
								<TableCell>{attendee.id}</TableCell>
								<TableCell>
									<div className='flex flex-col gap-1 '>
										<span className='font-semibold text-white'>{attendee.name}</span>
										<span>{attendee.email}</span>
									</div>
								</TableCell>
								{/* <TableCell>{formatRelative(attendee.createdAt, new Date(), { locale: ptBR })}</TableCell>
								<TableCell>{formatRelative(attendee.checkedInAt, new Date(), { locale: ptBR })}</TableCell> */}
								<TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
								<TableCell>
									{attendee.checkedInAt === null
										? <span className='text-zinc-700'>Não fez check-in</span>
										: dayjs().to(attendee.checkedInAt)}
								</TableCell>
								<TableCell>
									<IconButton transparent>
										<MoreHorizontal className='size-4' />
									</IconButton>
								</TableCell>
							</TableRow>
						)
					})}
				</tbody>
				<tfoot>
					<tr>
						<TableCell colSpan={3}>
							Mostrando {attendees.length} de {total} itens
						</TableCell>
						<TableCell colSpan={3} className='text-right'>
							<div className='inline-flex items-center gap-8'>
								<span>Página {page} de {totalPages}</span>
								<div className='flex gap-1.5'>
									<IconButton onClick={goToFirstPage} disabled={page === 1}>
										<ChevronsLeft className='size-4' />
									</IconButton>
									<IconButton onClick={goToPreviousPage} disabled={page === 1}>
										<ChevronLeft className='size-4' />
									</IconButton>
									<IconButton onClick={goToNextPage} disabled={page === totalPages}>
										<ChevronRight className='size-4' />
									</IconButton>
									<IconButton onClick={goToLastPage} disabled={page === totalPages}>
										<ChevronsRight className='size-4' />
									</IconButton>
								</div>
							</div>
						</TableCell>
					</tr>
				</tfoot>
			</Table>
		</div>
	)

}