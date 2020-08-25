const app = new Vue({
    el: '#app',
    data: {
        newTitle: '',
        newStartDate: '',
        newEndDate: '',
        sections: [],
    },
    methods: {
        duration(startDate, endDate) {
            return ((endDate - startDate) / (1000 * 3600 * 24 * 30)).toFixed(0)
        },
        showDate(date) {
            return date.toLocaleString('default', {month: 'short', year: 'numeric'})
        },
        addSection() {

            if (this.errors.length)
                return;
            let newSection = {
                title: this.newTitle,
                startDate: this.newStartDateFormat,
                endDate: this.newEndDateFormat,
                type: 'normal'
            };
            this.sections.push(newSection);
            this.newTitle = '';
            this.newStartDate = this.newEndDate;
            this.newEndDate = null;
        },
        removeSection(index) {
            this.sections.splice(index, 1);
        },
        compareDates(a, b) {
            if (a.startDate < b.startDate)
                return -1;
            if (a.startDate > b.startDate)
                return 1;
            return 0;
        },
        sectionClassType(sec) {
            if (sec.type === 'normal')
                return {'bg-success': true};
            if (sec.type === 'short-gap')
                return {'bg-warning': true};
            if (sec.type === 'long-gap')
                return {'bg-danger': true};
        },
        calcWidth(sec) {
            return this.duration(sec.startDate, sec.endDate) * 100 / this.timelineInfo.len + '%';
        },
        calcMargin(sec) {
            return this.duration(this.timelineInfo.start, sec.startDate) * 100 / this.timelineInfo.len + '%';
        }
    },
    computed: {
        finalSections: function () {
            const sortedSections = this.sections.sort(this.compareDates).filter(
                sec => sec.type === 'normal'
            );
            if (sortedSections.length >= 2) {
                let mostRecentEnd = sortedSections[0].endDate;
                let gaps = [];
                for (const sec of sortedSections) {
                    const duration = this.duration(mostRecentEnd, sec.startDate);
                    if (duration > 0) {
                        const gapType = duration > 3 ? 'long-gap' : 'short-gap';
                        const newGap = {
                            title: 'Gap',
                            startDate: mostRecentEnd,
                            endDate: sec.startDate,
                            type: gapType
                        };
                        gaps.push(newGap);
                    }
                    if (sec.endDate > mostRecentEnd)
                        mostRecentEnd = sec.endDate;
                }
                sortedSections.push(...gaps);
            }
            return sortedSections.sort(this.compareDates);
        },
        timelineInfo: function () {
            let earliestDate = new Date(8640000000000000);
            let lastDate = new Date(-8640000000000000);
            for (const sec of this.sections) {
                if (sec.startDate < earliestDate)
                    earliestDate = sec.startDate;
                if (sec.endDate > lastDate)
                    lastDate = sec.endDate;
            }
            return {
                start: earliestDate,
                end: lastDate,
                len: this.duration(earliestDate, lastDate)
            };
        },
        newStartDateFormat: function () {
            return new Date(this.newStartDate);
        },
        newEndDateFormat: function () {
            return new Date(this.newEndDate);
        },
        errors: function () {
            let ls = [];
            if (this.newStartDate && this.newEndDate &&
                this.newStartDateFormat > this.newEndDateFormat)
                ls.push('The end date cannot be before the start date.');
            return ls;
        }
    },
    created: function () {

    }
});