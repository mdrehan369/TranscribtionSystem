import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Dispatch, SetStateAction } from "react";

type Props = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  isNextAvailable: boolean;
}

function CustomPagination({ page, setPage, isNextAvailable }: Props) {
  return (
    <Pagination className="my-10">
      <PaginationContent>
        {
          page != 1 &&
          <PaginationItem>
            <PaginationPrevious className="cursor-pointer" onClick={() => setPage(page - 1)} />
          </PaginationItem>
        }
        {
          page > 1 &&
          <PaginationItem>
            <PaginationLink onClick={() => setPage(page - 1)}>{page - 1}</PaginationLink>
          </PaginationItem>
        }
        <PaginationItem>
          <PaginationLink isActive>{page}</PaginationLink>
        </PaginationItem>
        {
          isNextAvailable &&
          <>
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page + 1)} isActive >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext className="cursor-pointer" onClick={() => setPage(page + 1)} />
            </PaginationItem>
          </>
        }
      </PaginationContent>
    </Pagination>
  )
}

export default CustomPagination
